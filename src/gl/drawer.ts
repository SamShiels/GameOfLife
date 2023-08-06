
export class drawer {

  private _gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this._gl = gl;
  }

  public clear(): void {
    this._gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    this._gl.enable(this._gl.DEPTH_TEST); 
    //this._gl.enable(this._gl.CULL_FACE);
    
    // Clear the color buffer bit
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }

  public draw(indexCount: number): void {
    // Draw the triangle
    this._gl.drawElements(this._gl.TRIANGLES, indexCount, this._gl.UNSIGNED_SHORT, 0);
  }
}