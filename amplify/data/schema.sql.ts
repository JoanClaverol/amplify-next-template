/* eslint-disable */
/* THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY. */
import { a } from "@aws-amplify/data-schema";
import { configure } from "@aws-amplify/data-schema/internals";
import { secret } from "@aws-amplify/backend";

export const schema = configure({
    database: {
        identifier: "ID5rnvnCdkqXNYThhWN3Ochw",
        engine: "postgresql",
        connectionUri: secret("SQL_CONNECTION_STRING"),
        vpcConfig: {
            vpcId: "vpc-046287c517befa1a3",
            securityGroupIds: [
                "sg-060ea1eb930f699cd",
                "sg-04f33917a8bbb1d5a"
            ],
            subnetAvailabilityZones: [
                {
                    subnetId: "subnet-08072777bcf363845",
                    availabilityZone: "eu-west-3c"
                },
                {
                    subnetId: "subnet-01bb1c87e6126b717",
                    availabilityZone: "eu-west-3a"
                },
                {
                    subnetId: "subnet-0f1cdb3202d114a65",
                    availabilityZone: "eu-west-3b"
                }
            ]
        }
    }
}).schema({
    "advertising_glovo": a.model({
        status: a.string(),
        start_date: a.string(),
        gross_sales: a.float(),
        orders: a.float(),
        clicks: a.float(),
        impressions: a.float(),
        remaining_budget: a.float(),
        average_daily_budget: a.float(),
        total_spend: a.float(),
        store_name_scraped: a.string().required(),
        company: a.string().required(),
        datetime: a.string().required(),
        status_raw: a.string()
    }).identifier([
        "company",
        "store_name_scraped",
        "datetime"
    ]),
    "companies_glovo": a.model({
        company: a.string().required(),
        email: a.string().required()
    }).identifier([
        "company"
    ]),
    "invoices_glovo": a.model({
        invoice_number: a.string().required(),
        service_period: a.string(),
        invoice_date: a.string(),
        base_imponible: a.float(),
        total_factura: a.float(),
        ingreso_a_cuenta_colaborador: a.float(),
        tasa_de_acceso_a_la_plataforma_de_glovo: a.float(),
        servicio_de_los_repartidores: a.float(),
        descuento: a.float(),
        ivaigicipsi_21_: a.float(),
        productos: a.float(),
        servicio_de_entrega: a.float(),
        factura_total_en_negativo: a.float(),
        promocion_producto_asumida_por_partner: a.float(),
        coste_de_incidencias_sobre_productos: a.float(),
        tasa_de_tiempo_de_espera: a.float(),
        devoluciones_de_incidencias_sobre_productos: a.float(),
        coste_de_cancelaciones_e_incidencias_sobre_servicios: a.float(),
        free_delivery_por_incidencia: a.float(),
        glovos_ya_remunerados: a.float(),
        deuda_acumulada: a.float(),
        company: a.string(),
        marketing_de_promocion: a.float(),
        facturas_por_servicio_de_repartidor: a.float(),
        cupon: a.float(),
        promocion_df_asumida_por_el_partner: a.float(),
        tasa_de_activacion: a.float(),
        honorarios_gestion_pago_inmediato: a.float(),
        pago_inmediato_previamente_satisfecho: a.float(),
        tasa_de_acceso_a_la_plataforma_de_glovo_con_incidencias: a.float(),
        productos_con_incidencias: a.float(),
        service_start: a.string(),
        service_end: a.string()
    }).identifier([
        "invoice_number"
    ]),
    "invoices_info_on_glovo_page": a.model({
        company: a.string(),
        invoice_number: a.string().required(),
        address: a.string(),
        document_type: a.string(),
        issue_date: a.string(),
        period_from: a.string(),
        period_to: a.string(),
        taxable_base: a.float(),
        total_invoice: a.float(),
        total_payable: a.float(),
        datetime: a.string(),
        store_name_scraped: a.string()
    }).identifier([
        "invoice_number"
    ]),
    "order_history_glovo": a.model({
        time_of_order: a.string(),
        order_code: a.string().required(),
        order_status: a.string(),
        courier_name: a.string(),
        store: a.string(),
        store_address: a.string(),
        bad_rating: a.string(),
        product_issues: a.string(),
        cancellation_reason: a.string(),
        refund_amount: a.float(),
        promotions: a.float(),
        total: a.float(),
        dispute_state: a.string(),
        dispute_amount: a.float(),
        company: a.string().required()
    }).identifier([
        "company",
        "order_code"
    ]),
    "order_lines_glovo": a.model({
        glovo_code: a.string().required(),
        notification_partner_time: a.string(),
        description: a.string(),
        store_name: a.string(),
        store_address: a.string(),
        payment_method: a.string(),
        price_of_products: a.float(),
        product_promotion_paid_by_partner: a.float(),
        charged_to_partner_base: a.float(),
        courier_delivery_service: a.float(),
        glovo_platform_fee: a.float(),
        glovo_platform_discount: a.float(),
        total_charged_to_partner: a.float(),
        total_charged_to_partner_percentage: a.float(),
        delivery_promotion_paid_by_partner: a.float(),
        refunds_incidents: a.float(),
        products_paid_in_cash: a.float(),
        delivery_price_paid_in_cash: a.float(),
        courier_invoice_serial_number: a.string(),
        meal_vouchers_discounts: a.float(),
        courier_invoice_emission_date: a.string(),
        courier_name: a.string(),
        courier_address: a.string(),
        courier_city: a.string(),
        courier_province: a.string(),
        courier_postal_code: a.string(),
        courier_tax_id: a.string(),
        courier_invoice_taxable_base: a.float(),
        courier_invoice_iva_igic_ipsi: a.float(),
        courier_invoice_total_invoice: a.float(),
        incidents_to_pay_partner: a.float(),
        product_with_incidents: a.float(),
        incidents_glovo_platform_fee: a.float(),
        wait_time_fee: a.float(),
        wait_time_fee_refund: a.float(),
        invoice_number: a.string(),
        company: a.string().required(),
        delivery_price: a.float()
    }).identifier([
        "company",
        "glovo_code"
    ]),
    "stores_glovo": a.model({
        company: a.string().required(),
        store: a.string().required(),
        store_address: a.string().required()
    }).identifier([
        "company",
        "store",
        "store_address"
    ])
});
