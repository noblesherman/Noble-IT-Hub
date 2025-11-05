-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "description" TEXT,
    "impact" TEXT,
    "rootCause" TEXT,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);
