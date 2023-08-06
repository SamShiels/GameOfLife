import { shader } from "./shader";
import { vbo } from "./vbo";
import { renderTexture } from "./renderTexture";

export class canvas {

  private _gl: WebGLRenderingContext;
  private _texture: renderTexture;
  private _framebuffer: WebGLFramebuffer;

  private _positionVbo: vbo;
  private _texcoordVbo: vbo;
  private _indexVbo: vbo;

  private _shader: shader;

  private _resolutionWidth: number;
  private _resolutionHeight: number;

  constructor(gl: WebGLRenderingContext, resolutionWidth: number, resolutionHeight: number) {
    this._gl = gl;

    this._positionVbo = new vbo(gl);
    this._texcoordVbo = new vbo(gl);
    this._indexVbo = new vbo(gl, true);

    this._texture = new renderTexture(gl);

    this._texture.allocateMemory(resolutionWidth, resolutionHeight);

    this._framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
    this._texture.attachToFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    const positions: number[] = [];
    const texcoords: number[] = [];
    const indices: number[] = [];

    positions.push(-1, -1,
                    1, -1,
                    1,  1,
                   -1,  1);

    texcoords.push(0, 0,
                   1, 0,
                   1, 1,
                   0, 1);

    indices.push(0, 1, 2, 0, 2, 3);

    this._positionVbo.upload(positions);
    this._texcoordVbo.upload(texcoords);
    this._indexVbo.upload(indices);

    const vs = `
      attribute vec2 a_position;
      attribute vec2 a_texcoord;
  
      varying vec2 v_texcoord;
  
      void main(void) { 
        v_texcoord = a_texcoord;
  
        gl_Position = vec4(a_position, 0.0, 1.0); 
      }
    `;
  
    const fs = `
      precision mediump float;
  
      uniform sampler2D u_texture;
      
      varying vec2 v_texcoord;
      
      void main(void) { 
        gl_FragColor = texture2D(u_texture, v_texcoord);
      }
    `;

    this._shader = new shader(gl, vs, fs);

    this._resolutionWidth = resolutionWidth;
    this._resolutionHeight = resolutionHeight;
  }

  /**
   * Bind the canvas framebuffer to the WebGL context.
   *
   * @memberof canvas
   */
  public bindToCanvas(): void {
    this._texture.unbind();
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._framebuffer);
    this._gl.viewport(0, 0, this._resolutionWidth, this._resolutionHeight);
  }

  /**
   * Render the canvas texture to the screen.
   *
   * @memberof canvas
   */
  public drawCanvas(): void {
    this.unbind();
    this._texture.bind(0);

    const positionLocation = this._shader.positionLocation;
    this._positionVbo.attachAttribute(positionLocation, 2);
    const texcoordLocation = this._shader.texcoordLocation;
    this._texcoordVbo.attachAttribute(texcoordLocation, 2);
    this._indexVbo.bind();
    this._shader.use();

    const textureLocation = this._shader.getUniformLocation('u_texture');
    this._gl.uniform1i(textureLocation, 0);

    // Clear the color buffer bit
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    //this._gl.enable(this._gl.CULL_FACE);

    // Set the view port
    this._gl.viewport(0,0,this._gl.canvas.width,this._gl.canvas.height);

    // Pull the trigger
    this._gl.drawElements(this._gl.TRIANGLES, 6, this._gl.UNSIGNED_SHORT, 0);
  }

  /**
   * Unbind the canvas framebuffer from the WebGL context.
   *
   * @memberof canvas
   */
  public unbind(): void {
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  }
}