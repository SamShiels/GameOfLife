
export class vbo {

  private _gl: WebGLRenderingContext;
  private _buffer: WebGLBuffer;
  private _target: number;

  /**
   * Creates an instance of vbo.
   * @param {WebGLRenderingContext} gl WebGL context.
   * @param {boolean} [element] OPTIONAL: Use ELEMENT_ARRAY_BUFFER as target and Uint16Array as data type.
   * @memberof vbo
   */
  constructor(gl: WebGLRenderingContext, element?: boolean) {
    this._gl = gl;
    this._buffer = this._gl.createBuffer();

    this._target = element ? this._gl.ELEMENT_ARRAY_BUFFER : this._gl.ARRAY_BUFFER;
  }

  /**
   * Bind the buffer.
   *
   * @memberof vbo
   */
  public bind(): void {
    this._gl.bindBuffer(this._target, this._buffer);
  }

  /**
   * Point an attribute to the buffer.
   * 
   * @param {number} attributeLocation Attribute location.
   * @memberof vbo
   */
  public attachAttribute(attributeLocation: number, dimensions: number): void {
    this.bind();
    this._gl.vertexAttribPointer(attributeLocation, dimensions, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(attributeLocation);
  }

  /**
   * Upload to GPU.
   *
   * @param {number[]} data Number array to upload.
   * @memberof vbo
   */
  public upload(data: number[]): void {
    let source: BufferSource;

    if (this._target === this._gl.ELEMENT_ARRAY_BUFFER) {
      source = new Uint16Array(data);
    } else {
      source = new Float32Array(data);
    }

    this.bind();
    this._gl.bufferData(this._target, source, this._gl.DYNAMIC_DRAW);
  }

  /**
   * Bind to nothing.
   *
   * @memberof vbo
   */
  public unbind(): void {
    this._gl.bindBuffer(this._target, null);
  }

  /**
   * Destroy the object and all GL objects.
   *
   * @memberof vbo
   */
  public destroy(): void {
    this.unbind();
    this._gl.deleteBuffer(this._target);

    this._gl = null;
    this._buffer = null;
    this._target = null;
  }
}