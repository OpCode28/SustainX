export interface BRSRCoreAttributeItem {
    id: string;
    name: string;
    sourceRecord: string;
    unit: string;
}
export interface BRSRCoreAttribute {
    attributeNumber: number;
    title: string;
    description: string;
    scalingMethod: string;
    dataItems: BRSRCoreAttributeItem[];
    scope3Categories?: {
        number: number;
        name: string;
        sourceRecord: string;
    }[];
}
export declare const BRSR_CORE_ATTRIBUTES: BRSRCoreAttribute[];
//# sourceMappingURL=attributes.d.ts.map