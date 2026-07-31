import { useEffect, useState } from 'react';
import {
  EXPECTED_CONTRACT_VERSION,
  fetchMarketplaceContract,
  inspectContractCompatibility,
} from '../../contracts/marketplaceContract';

export default function ContractCompatibilityBanner() {
  const [state, setState] = useState({ checked: false, compatible: true, remote: null, issues: [] });

  useEffect(() => {
    let active = true;
    fetchMarketplaceContract()
      .then((remote) => {
        if (!active) return;
        const result = inspectContractCompatibility(remote);
        setState({ checked: true, compatible: result.compatible, remote, issues: result.issues });
      })
      .catch(() => active && setState({
        checked: true,
        compatible: false,
        remote: null,
        issues: ['Không thể tải hợp đồng tích hợp từ API.'],
      }));
    return () => { active = false; };
  }, []);

  if (!state.checked || state.compatible) return null;

  return (
    <div className="contract-compatibility-banner" role="alert">
      <strong>AXIRO Admin chưa đồng bộ hợp đồng API.</strong>
      <span>Mong đợi {EXPECTED_CONTRACT_VERSION}, nhận {state.remote?.contract_version || 'không xác định'}.</span>
      {state.issues.slice(0, 3).map((issue) => <span key={issue}>{issue}</span>)}
    </div>
  );
}
