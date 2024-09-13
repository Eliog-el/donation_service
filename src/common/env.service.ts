import * as dotenv from 'dotenv';
import * as fs from 'fs';

export interface EnvData {
  // application
  APP_ENV: string;
  APP_DEBUG: boolean;
  APP_PORT: string;

  // database
  DB_TYPE: 'mysql' | 'mariadb';
  DB_HOST?: string;
  DB_USERNAME: string;
  DB_PORT?: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;

  // INTERNAL API Calls
  BASE_URL: string;
  API_KEY: string;

  // Email Settings
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;

  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;

  MRKT_BASE_URL: string;

  VENDOR_BASE_URL: string;

  //Audit
  AUDIT_BASE_URL: string;

  SPLIT_CHARGE: number;
  REGULAR_CHARGE: number;

  // Sagmy
  SAGAMY_URL: string;
  SAGAMY_NIBSS_URL: string;

  // Gokari
  GOKARI_KEY: string;
  GOKARI_LOGISTICS_ID: string;
  GOKARI_API: string;
  ZONE_ID: string;
  GOKARI_EMAIL: string;
  GOKARI_PASSWORD: string;

  // Refund
  SPLIT_URL: string;

  // SHIPBUBBLE
  SHIP_BUBBLE_URL: string;
  SHIP_BUBBLE_TOKEN: string;

  // UK store
  UK_SENDCLOUD_SHIPMENT_PUBLIC_KEY: string;
  UK_SENDCLOUD_SHIPMENT_PRIVATE_KEY: string;
  UK_SENDCLOUD_SHIPMENT_URL: string;
}

export class EnvService {
  private vars: EnvData;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';
    const env_file = fs.existsSync(`.${environment}.env`)
      ? `.${environment}.env`
      : `.env`;
    const data: any = dotenv.parse(fs.readFileSync(env_file));

    data.APP_ENV = environment;
    data.APP_DEBUG = data.APP_DEBUG === 'true' ? true : false;
    data.DB_PORT = parseInt(data.DB_PORT);

    data.APP_PORT = parseInt(data.APP_PORT) || 3000;

    this.vars = data as EnvData;
  }

  read(): EnvData {
    return this.vars;
  }

  isDev(): boolean {
    return this.vars.APP_ENV === 'development';
  }

  isProd(): boolean {
    return this.vars.APP_ENV === 'production';
  }
}

export enum EmailTypes {
  CUST_PASSWORD_RESET = 'CUST_PASSWORD_RESET',
  CUST_PASSWORD_CHANGED = 'CUST_PASSWORD_CHANGED',
  CUST_WELCOME_EMAIL = 'CUST_WELCOME_EMAIL',
  CUST_ACCOUNT_VERIFIED = 'CUST_ACCOUNT_VERIFIED',
  CUST_OTP = 'CUST_OTP',
  CUST_VERIFIED = 'CUST_VERIFIED',
  PRODUCT_ACTIVITY = 'PRODUCT_ACTIVITY',
  VEND_PASSWORD_RESET = 'VEND_PASSWORD_RESET',
  VEND_PASSWORD_CHANGED = 'VEND_PASSWORD_CHANGED',
  VEND_WELCOME_EMAIL = 'VEND_WELCOME_EMAIL',
  VEND_ACCOUNT_VERIFIED = 'VEND_ACCOUNT_VERIFIED',
  VEND_OTP = 'VEND_OTP',
  ORDER_ACCEPTED = 'ORDER_ACCEPTED',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  SPLIT_ORDER_FAILED = 'SPLIT_ORDER_FAILED',
  SPLIT_ORDER_SUCCESSFUL = 'SPLIT_ORDER_SUCCESSFUL',
  SPLIT_ORDER_PAYMENT = 'SPLIT_ORDER_PAYMENT',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  PAYMENT_RECIEVED = 'PAYMENT_RECIEVED',
  VEND_VERIFIED = 'VEND_VERIFIED',
  VEND_ACCOUNT_APPROVED = 'VEND_ACCOUNT_APPROVED',
  VEND_ACCOUNT_DEACTIVATED = 'VEND_ACCOUNT_DEACTIVATED',
  VEND_PRODUCT_APPROVED = 'VEND_PRODUCT_APPROVED',
  VEND_PRODUCT_DEAPPROVED = 'VEND_PRODUCT_DEACTIVATED',
  VEND_NEW_ORDER = 'VEND_NEW_ORDER',
  SPLIT_ORDER_TRANSACTION_SUCCESSFUL = 'SPLIT_ORDER_TRANSACTION_SUCCESSFUL',
}
