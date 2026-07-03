export interface LocalMockAccount {
  userId: number;
  fullName: string;
  email: string;
  password: string;
  role: string;
  organization: {
    id: number;
    name: string;
    role: string;
  };
}

export interface StockFlowEnvironment {
  localMock: {
    enabled: boolean;
    account: LocalMockAccount | null;
  };
}
