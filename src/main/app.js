import { HapiHTTPServer } from './adapters/hapi-adapter';
import { HttpController } from './config/http-controller';

const hapiHttpServer = new HapiHTTPServer()
export default HttpController.create({
  httpServer: hapiHttpServer
})