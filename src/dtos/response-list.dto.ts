class MeasureDto {
    measure_uuid: string
    measure_datetime: Date
    measure_type: string
    has_confirmed: boolean
    image_url: string
}

export class ResponseListDto {
    customer_code: string
    measures: MeasureDto[]
}
