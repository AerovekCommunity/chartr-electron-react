import BigNumber from "bignumber.js";
import React from "react";

export enum TokenType {
    AERO,
    EGLD,
}

export interface ISendTokensViewProps {
    currentBalance: string;
    token: string;
    open: boolean;
    egldPrice: BigNumber;
    aeroPrice: BigNumber;
    userSettings: IUserSettings;
    password: string;
    transactionSent: (hash: string) => void;
    onClose: () => void;
}

export interface IConfirmSendTokensViewProps {
    open: boolean;
    recipientAddress: string;
    amount: BigNumber;
    amountDisplay: string;
    token: string;
    amountUsd: string;
    onClose: () => void;
}

export interface IWalletAddressViewProps {
    address: string;
    open: boolean;
    onClose: () => void;
}

export interface IHomeContainerProps {
    password: string;
    hasAccount: boolean;
}

export interface IHomeDetailViewProps {
    currentView: string;
    accountCreated: () => void;
    userSettings: IUserSettings;
    password: string;
}

export interface IWalletViewProps {
    userSettings: IUserSettings;
    password: string;
}

export interface IAccountViewProps {
    userSettings: IUserSettings;
    password: string;
}

export interface IProfileViewProps {
    account: IChartrAccount | null;
}

export interface IPilotsViewProps {
    password: string;
    userSettings: IUserSettings;
    account: IChartrAccount;
}

export interface IAircraftViewProps {
    password: string;
    userSettings: IUserSettings;
    account: IChartrAccount;
}

export interface IAddPilotViewProps {
    open: boolean;
    userSettings: IUserSettings;
    password: string;
    pilotAdded: () => void;
    onClose: () => void;
    account: IChartrAccount;
}

export interface ICreateAccountViewProps {
    userSettings: IUserSettings;
    accountCreated: (successful: boolean) => void;
    password: string;
}

export interface IPilotCertificate {
    title: string;
    description: string;
    type: string;
}

export interface IAircraft {
    id: string;
    model: string;
    description: string;
    typeDesignator: string;
    wtc: string;
    manufacturerCode: string;
    engineType: string;
    engineCount: number;
    seatCapacity: number;
    weightLimit: number;
    rangeInNauticalMiles: number;
    specialEquipment?: string;
}

export interface IPilotDetails {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    certificates?: IPilotCertificate[];
    qualifications?: string;
    bio?: string;
    flightTimeHours?: number;
    ratingsExpirationDate?: string;
    ratings?: string;
}

export interface IBusinessProfile {
    businessName: string;
    country: string;
    businessCategory: string;
    searchTags?: string[];
    pilotDetails?: IPilotDetails[];
    aircraftDetails?: IAircraft[];
}

export interface IFlightPackage {
    id: string;
    maxDistance: number;
    maxWeight: number;
    aircraft: IAircraft;
}

export interface IChartrAccount {
    /** The user's wallet address */
    id: string;
    
    accountType: string;
    username: string;
    recordVersion: number;
    timestamp: string;
    email: string;

    /** URL where this image is stored */
    profileImageUrl: string;

    businessProfile: IBusinessProfile;
}

export interface IUserSettings {
    walletAddress: string;
    publicKeyHex: string;
    keyfilePath?: string;
    userPin?: string;
    accountPending?: boolean;
}

export interface IAlertDialogProps {
    open: boolean;
    title: string;
    message: string;
    positiveButtonText: string;
    negativeButtonText: string;
    positiveFunc: () => void;
    negativeFunc: () => void;
}

export interface ITabPanelProps {
    children?: React.ReactNode;
    tabIndex: number;
    selectedTab: number;
}

export interface ITransactionHistoryItem {
    data?: string;
    fee: string;
    function: string;
    gasLimit: BigNumber;
    gasPrice: BigNumber;
    gasUsed: BigNumber;
    txHash: string;
    miniBlockHash: string;
    nonce: number;
    operation: string;
    receiver: string;
    receiverShard: string;
    round: BigNumber;
    searchOrder: number;
    sender: string;
    senderShard: number;
    signature: string;
    status: string;
    timestamp: number;
    value: string;
    version: number;
}