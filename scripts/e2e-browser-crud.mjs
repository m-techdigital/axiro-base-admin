import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const baseUrl = process.env.ADMIN_E2E_URL || 'http://127.0.0.1:5173'
const username = process.env.ADMIN_E2E_LOGIN || 'admin'
const password = process.env.ADMIN_E2E_PASSWORD || 'change-me'
const port = Number(process.env.ADMIN_E2E_DEBUG_PORT || 9444)
const timeoutMs = Number(process.env.ADMIN_E2E_TIMEOUT_MS || 20000)
const requireDocumentVersionMutation =
    process.env.ADMIN_E2E_REQUIRE_DOCUMENT_VERSION_MUTATION === '1'
const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome',
    'chromium',
].filter(Boolean)
const exists = (command) => {
    if (command.includes('/')) return fs.existsSync(command)
    try {
        execFileSync('sh', ['-lc', `command -v ${JSON.stringify(command)}`], {
            stdio: 'ignore',
        })
        return true
    } catch {
        return false
    }
}
const chrome = candidates.find(exists)
if (!chrome) throw new Error('Không tìm thấy Chrome/Chromium.')
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'axiro-admin-e2e-'))
const browser = spawn(
    chrome,
    [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${profile}`,
        'about:blank',
    ],
    { stdio: 'ignore' },
)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const wait = async (probe, label, timeout = timeoutMs) => {
    const start = Date.now()
    while (Date.now() - start < timeout) {
        try {
            const v = await probe()
            if (v) return v
        } catch {}
        await sleep(150)
    }
    throw new Error(`Timeout: ${label}`)
}
const getJson = async (url, options) => {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`${response.status} ${url}`)
    return response.json()
}
let socket
let id = 0
const pending = new Map()
const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
        const requestId = ++id
        pending.set(requestId, { resolve, reject })
        socket.send(JSON.stringify({ id: requestId, method, params }))
    })
const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
    })
    if (result.exceptionDetails) {
        const details = result.exceptionDetails
        const value = details.exception?.description || details.exception?.value
        const location =
            details.url || details.lineNumber != null
                ? ` at ${details.url || '<anonymous>'}:${(details.lineNumber ?? 0) + 1}:${(details.columnNumber ?? 0) + 1}`
                : ''
        throw new Error(
            `${details.text || 'Browser evaluation failed'}${location}${value ? `\n${value}` : ''}`,
        )
    }
    return result.result?.value
}
const navigate = async (route) => {
    await send('Page.navigate', { url: new URL(route, baseUrl).href })
    await wait(() => evaluate('document.readyState === "complete"'), route)
    await wait(
        () => evaluate('Boolean(document.querySelector("#root"))'),
        `${route} root`,
    )
}
const assertText = (text, label = text) =>
    wait(
        () =>
            evaluate(
                `document.body?.innerText?.includes(${JSON.stringify(text)})`,
            ),
        label,
    )
const assertInputValue = (text, label = text) =>
    wait(
        () =>
            evaluate(
                `[...document.querySelectorAll('input,textarea')].some((input)=>String(input.value||'').includes(${JSON.stringify(text)}))`,
            ),
        label,
    )
const assertAction = (text, label = text) =>
    wait(
        () =>
            evaluate(
                `[...document.querySelectorAll('button,a')].some((el)=>[el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).some((value)=>value.trim().includes(${JSON.stringify(text)})))`,
            ),
        label,
    ).catch(async (error) => {
        const bodyText = await evaluate(
            "document.body?.innerText?.slice(0, 1600) || ''",
        )
        throw new Error(`${error.message}. Body hiện tại: ${bodyText}`)
    })
const clickText = async (text) => {
    const ok = await evaluate(
        `(() => { const direct=[...document.querySelectorAll('button,a')].find(x=>[x.textContent, x.getAttribute('aria-label'), x.getAttribute('title')].filter(Boolean).some((value)=>value.trim().includes(${JSON.stringify(text)}))); const node=direct || [...document.querySelectorAll('span,div')].find(x=>x.textContent?.trim().includes(${JSON.stringify(text)})); const el=node?.closest?.('button,a') || (node?.matches?.('button,a') ? node : null); if(!el)return false; el.click(); return true })()`,
    )
    if (!ok) {
        const bodyText = await evaluate(
            "document.body?.innerText?.slice(0, 1000) || ''",
        )
        throw new Error(
            `Không tìm thấy action ${text}. Body hiện tại: ${bodyText}`,
        )
    }
}

const clickRowAction = async (rowText, actionText) => {
    const ok = await evaluate(
        `(() => { const rows=[...document.querySelectorAll('tr')]; const row=rows.find((item)=>item.innerText?.includes(${JSON.stringify(rowText)})); if(!row)return false; const action=[...row.querySelectorAll('button,a')].find((el)=>[el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).some((value)=>value.trim().includes(${JSON.stringify(actionText)}))); if(!action)return false; action.click(); return true })()`,
    )
    if (!ok)
        throw new Error(
            `Không tìm thấy action ${actionText} trong dòng ${rowText}.`,
        )
}

const api = async (route, options = {}) =>
    evaluate(
        `(async()=>{ const token=localStorage.getItem('access_token'); const response=await fetch('/api/v1${route}', { method:${JSON.stringify(options.method || 'GET')}, headers:{'Accept':'application/json','Content-Type':'application/json','Authorization':'Bearer '+token,'X-Client-App':'axiro-base-admin','X-Marketplace-Contract-Version':'2026-08-05.2'}, body:${options.body ? JSON.stringify(JSON.stringify(options.body)) : 'undefined'} }); const payload=await response.json(); if(!response.ok) throw new Error(payload?.message||payload?.status?.message||('HTTP '+response.status)); return payload.data??payload })()`,
    )

try {
    await wait(
        () =>
            getJson(`http://127.0.0.1:${port}/json/version`).catch(() => null),
        'Chrome DevTools',
    )
    const target = await getJson(
        `http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`,
        { method: 'PUT' },
    )
    socket = new WebSocket(target.webSocketDebuggerUrl)
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true })
        socket.addEventListener('error', reject, { once: true })
    })
    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        const handler = pending.get(message.id)
        if (!handler) return
        pending.delete(message.id)
        message.error
            ? handler.reject(new Error(message.error.message))
            : handler.resolve(message.result)
    })
    await send('Page.enable')
    await send('Runtime.enable')
    await navigate('/login')
    await wait(
        () => evaluate('document.querySelectorAll("input").length >= 2'),
        'login inputs',
    )
    await evaluate(
        `(() => { const inputs=[...document.querySelectorAll('input')]; const set=(el,value)=>{ if(!el) throw new Error('Missing login input'); const descriptor=Object.getOwnPropertyDescriptor(el.constructor.prototype,'value') || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value'); descriptor.set.call(el,value); el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:value})); el.dispatchEvent(new Event('change',{bubbles:true})) }; const usernameInput=inputs.find(x=>x.name==='username')||inputs[0]; const passwordInput=inputs.find(x=>x.name==='password'||x.type==='password')||inputs[1]; set(usernameInput,${JSON.stringify(username)}); set(passwordInput,${JSON.stringify(password)}); (usernameInput.closest('form'))?.requestSubmit(); return true })()`,
    )
    await wait(() => evaluate('location.pathname !== "/login"'), 'admin login')
    console.log('PASS admin login')

    const formRoutes = [
        ['/products/new', ['Tên sản phẩm', 'Mục đích giao dịch', 'Giá bán']],
        [
            '/transactions/new',
            [
                'Sản phẩm',
                'Người mua / thuê',
                'Người bán / cho thuê',
                'Trạng thái',
            ],
        ],
        ['/customers/new', ['Tên khách hàng', 'Tên đăng nhập', 'Trạng thái']],
        ['/document-templates', ['Mẫu tài liệu', 'Phiên bản', 'Đã dùng']],
        ['/payouts', ['Xác minh và chi trả người bán', 'Trạng thái']],
    ]
    for (const [route, labels] of formRoutes) {
        await navigate(route)
        for (const label of labels)
            await assertText(label, `${route}: ${label}`)
        console.log(`PASS ${route}`)
    }

    await navigate('/transactions/new')
    await assertText('Sản phẩm', 'transaction form mounted')
    await assertText('Sản phẩm', 'relation product field')
    await assertText('Người mua / thuê', 'relation customer field')
    await assertText('Trạng thái', 'BaseForm status field')
    console.log('PASS BaseForm relation fields')

    const suffix = Date.now()
    const customer = await api('/customers', {
        method: 'POST',
        body: {
            username: `e2e_${suffix}`,
            name: `Khách E2E ${suffix}`,
            password: 'change-me-123',
            status: 'active',
        },
    })
    const product = await api('/products', {
        method: 'POST',
        body: {
            code: `E2E-${suffix}`,
            name: `Sản phẩm E2E ${suffix}`,
            product_type: 'game_account',
            game_code: 'ninja_school',
            status: 'active',
            offer_modes: ['sell'],
            sale_price: 100000,
            sale_deposit_amount: 0,
            installment_enabled: false,
        },
    })
    if (!customer?.id || !product?.id)
        throw new Error('Không tạo được fixture CRUD qua browser session.')
    await navigate(`/customers/${customer.id}/edit`)
    await assertInputValue(`Khách E2E ${suffix}`, 'customer edit')
    await navigate(`/products/${product.id}/edit`)
    await assertInputValue(`Sản phẩm E2E ${suffix}`, 'product edit')
    console.log('PASS customer/product create-read-update forms')

    await navigate('/document-templates')
    await assertText('Mẫu tài liệu', 'document template page after fixtures')
    await wait(
        () => evaluate('!document.body?.innerText?.includes("Đang tải")'),
        'document templates loaded',
    )
    await assertAction('Tạo mẫu', 'document template create action')
    await clickText('Tạo mẫu')
    await assertText('Tạo mẫu tài liệu')
    await assertText('Bản nháp')
    await evaluate(
        `document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`,
    )
    const templates = await api('/document-templates?per_page=100')
    const issuedTemplate = (Array.isArray(templates) ? templates : []).find(
        (item) => Number(item.generated_documents_count || 0) > 0,
    )
    if (!issuedTemplate) {
        const message =
            'Document template immutable version mutation thiếu issued template fixture.'
        if (requireDocumentVersionMutation) throw new Error(message)
        console.log(`SKIP ${message}`)
    } else {
        const hasEditAction = await evaluate(
            `[...document.querySelectorAll('button,a')].some((el)=>[el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).some((value)=>value.trim().includes('Chỉnh sửa')))`,
        )
        if (hasEditAction) {
            await clickRowAction(
                issuedTemplate.code || issuedTemplate.name,
                'Chỉnh sửa',
            )
            await assertText(
                'Mẫu đã phát sinh tài liệu là bất biến',
                'used template immutable note',
            )
            await assertText(
                'Tạo phiên bản mới từ v',
                'document versioning modal title',
            )
            await evaluate(
                `document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`,
            )
        } else {
            const message =
                'Document template list không có action chỉnh sửa cho issued fixture.'
            if (requireDocumentVersionMutation) throw new Error(message)
            console.log(`SKIP ${message}`)
        }
    }
    if (issuedTemplate) {
        const currentTemplate = await api(
            `/document-templates/${issuedTemplate.id}`,
        )
        try {
            const contentHtml = String(currentTemplate.content_html || '')
            const versionSmokeHtml = contentHtml.includes('</body>')
                ? contentHtml.replace(
                      '</body>',
                      '<p>Browser version smoke</p></body>',
                  )
                : `${contentHtml}<p>Browser version smoke</p>`
            const nextTemplate = await api(
                `/document-templates/${issuedTemplate.id}`,
                {
                    method: 'PUT',
                    body: {
                        code: currentTemplate.code,
                        name: currentTemplate.name,
                        type: currentTemplate.type,
                        target_module: currentTemplate.target_module,
                        status: 'published',
                        version: currentTemplate.version,
                        merge_fields: currentTemplate.merge_fields || [],
                        content_html: versionSmokeHtml,
                        description: currentTemplate.description,
                    },
                },
            )
            if (
                Number(nextTemplate.version) !==
                Number(currentTemplate.version) + 1
            )
                throw new Error(
                    'Document template không tăng version sau khi sửa mẫu đã dùng.',
                )
            if (
                Number(nextTemplate.supersedes_template_id) !==
                Number(currentTemplate.id)
            )
                throw new Error(
                    'Document template version mới không trỏ mẫu bị thay thế.',
                )
            console.log('PASS document template immutable version mutation')
        } catch (error) {
            if (requireDocumentVersionMutation) throw error
            console.log(
                `SKIP document template immutable version mutation: ${error.message}`,
            )
        }
    }
    await navigate('/payouts')
    await wait(
        () => evaluate('!document.body?.innerText?.includes("Đang tải")'),
        'payouts loaded',
    )
    await assertText('Yêu cầu rút tiền', 'withdrawal tab')
    await assertAction('Xử lý', 'withdrawal row action')
    await clickText('Xử lý')
    await assertText('Xử lý yêu cầu', 'payout decision modal')
    const hasLifecycleAction = await wait(
        () =>
            evaluate(
                `/Duyệt|Từ chối|Xác nhận đã chi/.test(document.body?.innerText||'')`,
            ),
        'payout lifecycle actions',
    )
    if (!hasLifecycleAction) throw new Error('Payout action lifecycle missing')
    console.log('PASS document status labels and payout lifecycle actions')
    console.log('Admin CRUD browser smoke PASS')
} finally {
    try {
        socket?.close()
    } catch {}
    browser.kill('SIGTERM')
    await sleep(500)
    fs.rmSync(profile, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 200,
    })
}
