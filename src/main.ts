import { canvas } from './gl/canvas';
import { drawer } from './gl/drawer';
import './style.css'

function init() {
  const canvasElement = <HTMLCanvasElement>document.getElementById('canvas');
  const context = canvasElement.getContext('webgl');

  const canvasHelper = new canvas(context, context.canvas.width, context.canvas.height);
  const drawerHelper = new drawer(context);

  canvasHelper.bindToCanvas();
  drawerHelper.clear();

  canvasHelper.drawCanvas();
}

init();