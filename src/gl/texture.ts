
export class texture {

  protected _gl: WebGLRenderingContext;
  protected _texture: WebGLTexture;

  protected _width: number;
  protected _height: number;

  constructor(gl: WebGLRenderingContext) {
    this._gl = gl;
    this._texture = this._gl.createTexture();
  }

  protected _applyParameters(): void {
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
  }

  /**
   * Binds the texture to the current state. Unit 0 is the canvas.
   *
   * @memberof texture
   */
  public bind(unit: number): void {
    this._gl.activeTexture(this._gl.TEXTURE0 + unit);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
  }

  /**
   * Uploads an image to the GPU
   *
   * @param {HTMLImageElement} image The image to upload. Cannot be null.
   * @return {*}  {void}
   * @memberof texture
   */
  public uploadImage(image: HTMLImageElement): void {
    this.bind(0);
    if (image === null) {
      console.error('Image is null');
      return;
    }

    this._applyParameters();
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);

    this._width = image.width;
    this._height = image.height;
  }

  /**
   * Unbinds the texture from the current state.
   *
   * @memberof texture
   */
  public unbind(): void {
    this._gl.bindTexture(this._gl.TEXTURE_2D, null);
  }

  /**
   * Destroys the texture.
   *
   * @memberof texture
   */
  public destroy(): void {
    this._gl.deleteTexture(this._texture);
    this._texture = null;
    this._gl = null;
    
    this._width = null;
    this._height = null;
  }
}