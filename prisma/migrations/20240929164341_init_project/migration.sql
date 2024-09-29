-- CreateTable
CREATE TABLE "measures" (
    "measure_uuid" UUID NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "has_confirmed" BOOLEAN DEFAULT false,
    "image_url" TEXT NOT NULL,
    "measure_value" DOUBLE PRECISION NOT NULL,
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("measure_uuid")
);
