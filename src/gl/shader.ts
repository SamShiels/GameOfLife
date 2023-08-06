
export class shader {
  
  private _gl: WebGLRenderingContext;
  private _program: WebGLProgram;
  private _vertexShader: WebGLShader;
  private _fragmentShader: WebGLShader;

  private _positionLocation: number;
  public get positionLocation(): number {
    return this._positionLocation;
  }

  private _texcoordLocation: number;
  public get texcoordLocation(): number {
    return this._texcoordLocation;
  }

  private _projectionMatrixUniformLocation: WebGLUniformLocation;
  private _viewMatrixUniformLocation: WebGLUniformLocation;
  private _textureSamplerUniformLocation: WebGLUniformLocation;
  
  /**
   * Creates an instance of shader.
   * @param {WebGLRenderingContext} gl Webgl context.
   * @param {string} vertexSource vertex source script.
   * @param {string} fragmentSource fragment source script.
   * @memberof shader
   */
  constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    this._gl = gl;

    this._vertexShader = gl.createShader(gl.VERTEX_SHADER);    
    this._fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(this._vertexShader, vertexSource);
    gl.shaderSource(this._fragmentShader, fragmentSource);

    gl.compileShader(this._vertexShader);
    gl.compileShader(this._fragmentShader);

    this._program = gl.createProgram();
    gl.attachShader(this._program, this._vertexShader);
    gl.attachShader(this._program, this._fragmentShader);
    gl.linkProgram(this._program);

    if (!gl.getShaderParameter(this._vertexShader, gl.COMPILE_STATUS)) {
      console.error("Vertex shader error: " + gl.getShaderInfoLog(this._vertexShader));
    }
    if (!gl.getShaderParameter(this._fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error: " + gl.getShaderInfoLog(this._fragmentShader));
    }

    this._projectionMatrixUniformLocation = this._gl.getUniformLocation(this._program, 'u_projectionMatrix');
    this._viewMatrixUniformLocation = this._gl.getUniformLocation(this._program, 'u_viewMatrix');
    this._textureSamplerUniformLocation = this._gl.getUniformLocation(this._program, 'u_texture');

    this._positionLocation = gl.getAttribLocation(this._program, "a_position");
    this._texcoordLocation = gl.getAttribLocation(this._program, "a_texcoord");
  }

  /**
   * Use the program.
   * 
   * @memberof shader
   */
  public use(): void {
    this._gl.useProgram(this._program);
  }

  /**
   * Get an attribute location.
   *
   * @param {string} attributeName Shader attribute name.
   * @return {*}  {number}
   * @memberof shader
   */
  public getAttributeLocation(attributeName: string): number {
    return this._gl.getAttribLocation(this._program, attributeName);
  }

  /**
   * Get a uniform location.
   *
   * @param {string} uniformName Shader uniform name.
   * @return {*}  {WebGLUniformLocation}
   * @memberof shader
   */
  public getUniformLocation(uniformName: string): WebGLUniformLocation {
    return this._gl.getUniformLocation(this._program, uniformName);
  }

  /**
   * Upload the projection matrix.
   *
   * @param {number[]} matrix
   * @memberof shader
   */
  public applyProjectionMatrix(matrix: number[]): void {
    this._gl.uniformMatrix3fv(this._projectionMatrixUniformLocation, false, matrix);
    this._gl.uniform1i(this._textureSamplerUniformLocation, 1);
  }

  /**
   * Upload the view matrix.
   *
   * @param {number[]} matrix
   * @memberof shader
   */
  public applyViewMatrix(matrix: number[]): void {
    this._gl.uniformMatrix3fv(this._viewMatrixUniformLocation, false, matrix);
    this._gl.uniform1i(this._textureSamplerUniformLocation, 1);
  }

  /**
   * Upload the current sampler texture unit.
   *
   * @param {number} unit
   * @memberof shader
   */
  public setSamplerLocation(unit: number): void {
    this._gl.uniform1i(this._textureSamplerUniformLocation, unit);
  }

  /**
   * Destroy the object.
   *
   * @memberof shader
   */
  public destroy(): void {
    this._gl.deleteShader(this._vertexShader);
    this._vertexShader = null;
    this._gl.deleteShader(this._fragmentShader);
    this._fragmentShader = null;

    this._gl.deleteProgram(this._program);
    this._program = null;

    this._gl = null;
  }
}