export interface CommandLog {
  timestamp: string;
  level: "INFO" | "WARNING" | "CRITICAL" | "ALERT";
  source: string;
  message: string;
}

export interface ActsLure {
  id: string;
  target: string;
  token: string;
  watermark: string;
  padding: string;
  status: "ACTIVE" | "TRIGGERED";
  interacted: boolean;
  interactionTelemetry?: {
    timestamp: string;
    resolvedIp: string;
    geolocation: string;
    dnsQueryPath: string;
  } | null;
}

export interface InsiderProfile {
  id: string;
  name: string;
  clearance: string;
  role: string;
  riskScore: number;
  status: "CLEAR" | "MONITORED" | "SUSPECTED_NSITA" | "REVOKED";
  bSauMetrics: string;
}

export interface OntologyNode {
  id: string;
  label: string;
  type: "Terminal" | "Lure" | "Host" | "Adversary";
  status: string;
  contacts: string;
  x?: number;
  y?: number;
}

export interface OntologyLink {
  source: string;
  target: string;
  relation: "GENERATE" | "ACCESSED" | "RESOLVED_BEACON";
}

export interface SystemState {
  activeThreats: number;
  cadlLevel: number;
  cadlStatus: string;
  hardwareBindingId: string;
  loraFrequency: number;
  ewJamming: boolean;
  systemLocked: boolean;
  systemIntegrity: number;
  logs: CommandLog[];
  actsLedger: ActsLure[];
  insiders: InsiderProfile[];
  ontology: {
    nodes: OntologyNode[];
    links: OntologyLink[];
  };
}
