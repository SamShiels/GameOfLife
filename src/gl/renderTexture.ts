import { texture } from "./texture";

export class renderTexture extends texture {

  constructor(gl: WebGLRenderingContext) {
    super(gl);
  }

  /**
   * Allocates memory for the texture. Unecessary if uploading an image with `uploadTexture`.
   *
   * @param {number} width Width of the texture in pixels.
   * @param {number} height Height of the texture in pixels.
   * @memberof texture
   */
  public allocateMemory(width: number, height: number): void {
    this.bind(0);
    this._applyParameters();
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, width, height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);

    this._width = width;
    this._height = height;
  }

  /**
   * Attaches the texture to the current framebuffer.
   *
   * @memberof texture
   */
  public attachToFramebuffer(): void {
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._texture, 0);

    const depth = this._gl.createRenderbuffer();
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, depth);

    this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);
    this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, depth);
  }
}