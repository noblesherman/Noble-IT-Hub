// Temporary stub while database is disabled.
// Prevents build errors when @prisma/client is not installed.
// If any code touches prisma at runtime, it will throw.

type PrismaStub = { [key: string]: any };

const prismaProxy: PrismaStub = new Proxy(
  {},
  {
    get() {
      throw new Error(
        "Database disabled for this build. Remove DB calls or re-enable Prisma."
      );
    }
  }
);

export const prisma = prismaProxy as any;
export default prisma;