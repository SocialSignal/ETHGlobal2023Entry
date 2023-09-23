import toast from "react-hot-toast";
let errorSfx: any = null;

export const toastError = ({ audioEnabled }: any, ...props: any) => {
  if (audioEnabled) {
    try {
      if (errorSfx == null) errorSfx = new Audio("/sfx/error.mp3");
      errorSfx.currentTime = 0;
      errorSfx.volume = 1;
      errorSfx.play();
    } catch (e) {}
  }

  toast.error.apply(this, props);
};
