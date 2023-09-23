export default function ConnectTakeover() {
  return (
    <div>
      <div className="w-[100vw] h-[100vh] radial-bg flex animate-pulse absolute top-0 left-0"></div>
      <div className="w-[100vw] h-[100vh] flex items-center">
        <div className="animate-bounce m-auto">
          <w3m-button label="Connect Wallet" balance="show" />
        </div>
      </div>
    </div>
  );
}
