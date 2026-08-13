declare module 'zxcvbn' {
  export type ZXFeedback = {
    warning?: string;
    suggestions?: string[];
  };

  export type ZXResult = {
    score: number; // 0-4
    crack_times_seconds?: Record<string, number>;
    crack_times_display?: Record<string, string>;
    feedback?: ZXFeedback;
    [key: string]: any;
  };

  function zxcvbn(password: string): ZXResult;

  export default zxcvbn;
}
