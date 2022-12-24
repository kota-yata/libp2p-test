import { createLibp2p, Libp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { kadDHT } from "@libp2p/kad-dht";

export class KadNode {
  public node: Libp2p = null as unknown as Libp2p;
  async createNode() {
    this.node = await createLibp2p({
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/0"]
      },
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [mplex()],
      dht: kadDHT()
    });
    return this.node;
  }
}
