import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer';
import { publicProcedure, router } from '../trpc.js';

const tp = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'printer:BIXOLON_SRP_330II',
  driver: require('printer'),
});

export const printerRouter = router({
  test: publicProcedure.mutation(async () => {
    tp.println('Hello World!');
    tp.cut();
    tp.execute();
    return 'success';
  }),
});
