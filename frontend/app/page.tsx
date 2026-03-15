export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Supply-Link</h1>
      <p className="text-lg text-gray-600 mb-2">
        Decentralized supply chain provenance tracker
      </p>
      <p className="text-sm text-gray-400">
        Powered by{" "}
        <a
          href="https://stellar.org"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Stellar
        </a>{" "}
        &amp;{" "}
        <a
          href="https://soroban.stellar.org"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Soroban
        </a>
      </p>
    </main>
  );
}
