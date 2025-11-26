import protobuf, { Root, Type } from 'protobufjs';

/**
 * Cache for loaded protobuf schema
 */
let cachedRoot: Root | null = null;

/**
 * Fetch and compile the protobuf schema from the server
 * @param baseUrl The base URL of the OPNet node
 * @returns The compiled protobuf root
 */
export async function loadProtobufSchema(baseUrl: string): Promise<Root> {
    if (cachedRoot) {
        return cachedRoot;
    }

    // Normalize URL
    let url = baseUrl.trim();
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    // Fetch the proto schema from the server
    const schemaUrl = `${url}/api/v1/protobuf/api-schema`;

    const response = await fetch(schemaUrl);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch protobuf schema: ${response.status} ${response.statusText}`,
        );
    }

    const protoContent = await response.text();

    // Parse the proto content
    cachedRoot = protobuf.parse(protoContent, { keepCase: true }).root;

    return cachedRoot;
}

/**
 * Get a protobuf type from the loaded schema
 * @param root The protobuf root
 * @param typeName The type name (without namespace prefix)
 * @returns The protobuf type
 */
export function getProtobufType(root: Root, typeName: string): Type {
    const fullPath = `OPNetAPIProtocol.${typeName}`;
    return root.lookupType(fullPath);
}

/**
 * Clear the cached schema (useful for reconnection to different servers)
 */
export function clearProtobufCache(): void {
    cachedRoot = null;
}
