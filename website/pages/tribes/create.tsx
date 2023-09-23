import { useState } from "react";

export default () => {
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  return (
    <div>
      <h1>Create a tribe</h1>
      <input
        type="text"
        placeholder="tribe name"
        className="input input-bordered input-primary w-full max-w-xs"
      />
      <textarea
        className="textarea textarea-primary"
        placeholder="description"
      />

      <div>
        Select a large avatar size
        <input
          type="file"
          className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
        />
      </div>

      {/* TODO: Automatically resize, but give user option to upload a different image specifically for small sizes */}
      <div>
        Select a small avatar size
        <input
          type="file"
          className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
        />
      </div>

      {isActionInProgress ? (
        <button className="btn" disabled>
          <span className="loading loading-spinner"></span>
          loading
        </button>
      ) : (
        <button
          className="btn"
          onClick={() => {
            setIsActionInProgress(true);
          }}
          disabled={isActionInProgress}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Create
        </button>
      )}
    </div>
  );
};
