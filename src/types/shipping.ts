export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  regions?: string[];
  rates: ShippingRate[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingRate {
  id: string;
  name: string;
  description?: string;
  price: number;
  freeShippingThreshold?: number;
  weightBased: boolean;
  weightMin?: number;
  weightMax?: number;
  estimatedDelivery: string;
  carrier?: string;
  serviceCode?: string;
  trackingAvailable: boolean;
  signatureRequired: boolean;
  insuranceIncluded: boolean;
  active: boolean;
}

export interface FreightCarrier {
  id: string;
  name: string;
  code: string;
  logo?: string;
  trackingUrl: string;
  apiEndpoint?: string;
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
  };
  services: CarrierService[];
  active: boolean;
}

export interface CarrierService {
  id: string;
  name: string;
  code: string;
  estimatedDays: number;
  trackingSupported: boolean;
  signatureRequired: boolean;
  insuranceAvailable: boolean;
  maxWeight?: number;
  maxDimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ShippingLabel {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  service: string;
  labelUrl: string;
  cost: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  fromAddress: Address;
  toAddress: Address;
  createdAt: Date;
  status: 'created' | 'printed' | 'shipped' | 'delivered' | 'exception';
}

export interface Address {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}

export interface ShippingAnalytics {
  totalShipments: number;
  totalCost: number;
  averageCost: number;
  onTimeDeliveryRate: number;
  carrierPerformance: Array<{
    carrier: string;
    shipments: number;
    cost: number;
    onTimeRate: number;
    averageDeliveryDays: number;
  }>;
  zonePerformance: Array<{
    zone: string;
    shipments: number;
    cost: number;
    averageDeliveryDays: number;
  }>;
}