declare module "@hcaptcha/react-hcaptcha" {
  import * as React from "react";

  interface HCaptchaProps {
    onVerify?: (token: string) => void;
    onExpire?: () => void;
    onError?: (event: any) => void;
    onClose?: () => void;
    onChalExpired?: () => void;
    onOpen?: () => void;
    onLoad?: () => void;
    languageOverride?: string;
    sitekey: string;
    size?: "normal" | "compact" | "invisible";
    theme?: "light" | "dark";
    tabIndex?: number;
    id?: string;
    reCaptchaCompat?: boolean;
    ref?: React.Ref<any>;
  }

  interface HCaptchaState {
    isReady: boolean;
    isRemoved: boolean;
    elementId: string;
    captchaId: string;
  }

  class HCaptcha extends React.Component<HCaptchaProps, HCaptchaState> {
    resetCaptcha(): void;
    renderCaptcha(): void;
    removeCaptcha(): void;
    execute(opts?: { async: boolean }): Promise<{ response: string; key: string }> | void;
  }

  export default HCaptcha;
}
