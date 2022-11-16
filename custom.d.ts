type SvgrUrl = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

type SvgrComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

declare module '*.svg' {
  export const ReactComponent: SvgrComponent;
  const value: SvgrUrl;
  export default value;
}

interface Window {
  web3: Web3;
  ethereum: any;
}
