import mongoose, { Document, Schema } from "mongoose"

export type PermissionsType = {
    products: string[]
    customers: string[]
    orders: string[]
    analytics: string[]
    financial: string[]
};

export type PermissionPayload = {
    role?: string
    actions: PermissionsType
}

export interface IPermission extends Document, PermissionsType  {
    role: string
};

const PermissionSchema = new Schema<IPermission>({
    role: { type: String, required: true },
    products: { type: [ String ], default: []},
    customers: { type: [ String ], default: []},
    orders: { type: [ String ], default: []},
    analytics: { type: [ String ], default: []},
    financial: { type: [ String ], default: []},
})

PermissionSchema.index({ role: 1, module: 1 }, { unique: true })

const Permission = mongoose.model<IPermission>("Permissions", PermissionSchema, "permissions")
export default Permission