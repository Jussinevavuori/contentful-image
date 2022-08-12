import contentfulImage from "../src";

const _ = contentfulImage;

describe("contentfulImage", () => {
  it("Should return URL without options when none provided", () => {
    const url = "https://a.b.c/img";
    expect(_(url)).toBe(url);
  });

  it("Should return URL with https: prepended and query removed", () => {
    const url = "//a.b.c/img?a=b";
    expect(_(url)).toBe("https://a.b.c/img");
  });

  it("Should return the correct formats", () => {
    const url = "https://a.b.c/";
    expect(_(url, { format: "avif" })).toBe(url + "?fm=avif");
    expect(_(url, { format: "webp" })).toBe(url + "?fm=webp");
    expect(_(url, { format: "png" })).toBe(url + "?fm=png");
    expect(_(url, { format: "png/png8" })).toBe(url + "?fm=png&fl=png8");
    expect(_(url, { format: "jpg" })).toBe(url + "?fm=jpg");
    expect(_(url, { format: "jpg/progressive" })).toBe(
      url + "?fm=jpg&fl=progressive"
    );
    expect(_(url, { format: "gif" })).toBe(url + "?fm=gif");
  });

  it("Should return correct width and height", () => {
    const url = "https://a.b.c/";
    expect(_(url, { width: 123, height: 456 })).toBe(url + "?w=123&h=456");
  });

  it("Should return correct ƒit type", () => {
    const url = "https://a.b.c/";
    expect(_(url, { fit: "crop" })).toBe(url + "?fit=crop");
    expect(_(url, { fit: "fill" })).toBe(url + "?fit=fill");
    expect(_(url, { fit: "pad" })).toBe(url + "?fit=pad");
    expect(_(url, { fit: "thumb" })).toBe(url + "?fit=thumb");
    expect(_(url, { fit: "scale" })).toBe(url + "?fit=scale");
  });

  it("Should return correct focus area type", () => {
    const url = "https://a.b.c/";
    expect(_(url, { focusArea: "center" })).toBe(url + "?f=center");
    expect(_(url, { focusArea: "top" })).toBe(url + "?f=top");
    expect(_(url, { focusArea: "left" })).toBe(url + "?f=left");
    expect(_(url, { focusArea: "right" })).toBe(url + "?f=right");
    expect(_(url, { focusArea: "bottom" })).toBe(url + "?f=bottom");
    expect(_(url, { focusArea: "top_right" })).toBe(url + "?f=top_right");
    expect(_(url, { focusArea: "bottom_right" })).toBe(url + "?f=bottom_right");
    expect(_(url, { focusArea: "top_left" })).toBe(url + "?f=top_left");
    expect(_(url, { focusArea: "bottom_left" })).toBe(url + "?f=bottom_left");
    expect(_(url, { focusArea: "face" })).toBe(url + "?f=face");
    expect(_(url, { focusArea: "faces" })).toBe(url + "?f=faces");
  });

  it("Should return correct border radius", () => {
    const url = "https://a.b.c/";
    expect(_(url, { radius: "max" })).toBe(url + "?r=max");
    expect(_(url, { radius: 1234 })).toBe(url + "?r=1234");
  });

  it("Should return correct quality, clamped and rounded", () => {
    const url = "https://a.b.c/";
    expect(_(url, { quality: 1 })).toBe(url + "?q=1");
    expect(_(url, { quality: 100 })).toBe(url + "?q=100");
    expect(_(url, { quality: 0 })).toBe(url + "?q=1");
    expect(_(url, { quality: -1 })).toBe(url + "?q=1");
    expect(_(url, { quality: 10000 })).toBe(url + "?q=100");
    expect(_(url, { quality: 51.1 })).toBe(url + "?q=51");
  });

  it("Should return correct background color, transformed", () => {
    const url = "https://a.b.c/";
    expect(_(url, { backgroundColor: "#123123" })).toBe(url + "?bg=rgb:123123");
    expect(_(url, { backgroundColor: "abcabc" })).toBe(url + "?bg=rgb:abcabc");
  });
});
