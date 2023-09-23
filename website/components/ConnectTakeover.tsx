export default function ConnectTakeover({ onConnect }: any) {
  return (
    <div className="w-100vw h-[100vh] radial-bg flex">
      <div className="m-auto">
        <button onClick={onConnect}>Connect your wallet</button>
      </div>
    </div>
  );
}
