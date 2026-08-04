import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const baseUrl = process.env.ADMIN_E2E_URL || 'http://127.0.0.1:5173'
const username = process.env.ADMIN_E2E_LOGIN || 'admin'
const password = process.env.ADMIN_E2E_PASSWORD || 'change-me'
const outputDir = path.resolve(
    process.env.ADMIN_VISUAL_OUTPUT || 'artifacts/visual-admin',
)
const port = Number(process.env.ADMIN_VISUAL_DEBUG_PORT || 9555)
const routes = [
    '/customers/new',
    '/products/new',
    '/transactions/new',
    '/document-templates',
    '/payments',
    '/wallet-deposits',
    '/payouts',
    '/disputes',
    '/audit-logs',
    '/generated-documents',
    '/action-center',
    '/marketplace-operations',
]
const viewports = [
    ['desktop', 1440, 1000, false],
    ['tablet', 834, 1112, true],
    ['mobile', 390, 844, true],
]
const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
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
fs.mkdirSync(outputDir, { recursive: true })
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'axiro-admin-visual-'))
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
const waitForBrowserExit = () =>
    new Promise((resolve) => {
        if (browser.exitCode !== null || browser.signalCode) {
            resolve()
            return
        }

        browser.once('exit', resolve)
        browser.once('error', resolve)
        browser.kill('SIGTERM')
        setTimeout(resolve, 3000)
    })
const wait = async (probe, label, timeout = 25000) => {
    const start = Date.now()

    while (Date.now() - start < timeout) {
        try {
            const value = await probe()

            if (value) return value
        } catch {}

        await sleep(150)
    }

    throw new Error(`Timeout: ${label}`)
}
let socket
let id = 0
const pending = new Map()
const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
        const rid = ++id
        pending.set(rid, { resolve, reject })
        socket.send(JSON.stringify({ id: rid, method, params }))
    })
const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
    })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
    return result.result?.value
}
const navigate = async (route) => {
    await send('Page.navigate', { url: new URL(route, baseUrl).href })
    await wait(() => evaluate('document.readyState === "complete"'), route)
    await sleep(500)
}
const screenshot = async (name) => {
    const result = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
    })
    fs.writeFileSync(
        path.join(outputDir, `${name}.png`),
        Buffer.from(result.data, 'base64'),
    )
}
try {
    const targets = await wait(async () => {
        try {
            return await (await fetch(`http://127.0.0.1:${port}/json`)).json()
        } catch {
            return null
        }
    }, 'Chrome CDP')
    const page = targets.find((item) => item.type === 'page')
    socket = new WebSocket(page.webSocketDebuggerUrl)
    socket.onmessage = (event) => {
        const payload = JSON.parse(event.data)
        if (payload.id && pending.has(payload.id)) {
            const p = pending.get(payload.id)
            pending.delete(payload.id)
            payload.error
                ? p.reject(new Error(payload.error.message))
                : p.resolve(payload.result)
        }
    }
    await new Promise((resolve) => (socket.onopen = resolve))
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
    for (const [label, width, height, mobile] of viewports) {
        await send('Emulation.setDeviceMetricsOverride', {
            width,
            height,
            deviceScaleFactor: 1,
            mobile,
        })
        for (const route of routes) {
            await navigate(route)
            const overflow = await evaluate(
                'Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth',
            )
            if (overflow > 2)
                throw new Error(
                    `${route} tràn ngang ${overflow}px tại ${label}`,
                )
            const broken = await evaluate(
                `[...document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not(.ant-select-input):not(.ant-select-selection-search-input),textarea,.ant-select:not(.ant-pagination-options-size-changer),.ant-picker')].map((el)=>{const r=el.getBoundingClientRect();return {tag:el.tagName,className:el.className,name:el.getAttribute('name'),type:el.getAttribute('type'),width:Math.round(r.width),text:el.textContent?.trim()?.slice(0,80)}}).filter((item)=>item.width>0&&item.width<90)`,
            )
            if (broken.length > 0)
                throw new Error(
                    `${route} có field bị bóp hẹp tại ${label}: ${JSON.stringify(broken.slice(0, 5))}`,
                )
            await screenshot(
                `${label}-${route.replaceAll('/', '_').replace(/^_/, '') || 'home'}`,
            )
        }
    }
    console.log(`Admin visual regression PASS: ${outputDir}`)
} finally {
    try {
        socket?.close()
    } catch {}
    await waitForBrowserExit()
    fs.rmSync(profile, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 150,
    })
}
