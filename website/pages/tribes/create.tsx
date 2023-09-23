import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export default () => {
  const router = useRouter();

  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [largeAvatar, setLargeAvatar] = useState<File>();
  const [smallAvatar, setSmallAvatar] = useState<File>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!largeAvatar) {
      toast.error("Large avatar is required");
      return;
    } else if (!name?.trim().length) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsActionInProgress(true);
      const data = new FormData();
      data.set("largeAvatar", largeAvatar);
      data.set("name", name);

      if (description) data.set("description", description);
      if (smallAvatar) data.set("smallAvatar", smallAvatar);

      const res = await fetch("/api/tribes/create", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      } else {
        router.push(res.url);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsActionInProgress(false);
    }
  };

  return (
    <div>
      <h1>Create a tribe</h1>
      <input
        type="text"
        placeholder="tribe name"
        className="input input-bordered input-primary w-full max-w-xs"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="textarea textarea-primary"
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        Select a large avatar size
        <input
          type="file"
          className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
          onChange={(e) => setLargeAvatar(e.target.files?.[0])}
        />
      </div>

      {/* TODO: Automatically resize, but give user option to upload a different image specifically for small sizes */}
      <div>
        Select a small avatar size
        <input
          type="file"
          className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
          onChange={(e) => setSmallAvatar(e.target.files?.[0])}
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
          onClick={(e: any) => {
            onSubmit(e);
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
