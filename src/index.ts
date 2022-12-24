import delay from "delay";
import all from "it-all";
import { CID } from "multiformats/cid";
import { KadNode } from "./node";

(async () => {
  const [node1, node2, node3] = await Promise.all([
    new KadNode().createNode(), new KadNode().createNode(), new KadNode().createNode()
  ]);

  await node1.peerStore.addressBook.set(node2.peerId, node2.getMultiaddrs())
  await node2.peerStore.addressBook.set(node3.peerId, node3.getMultiaddrs())

  await Promise.all([
    node1.dial(node2.peerId),
    node2.dial(node3.peerId)
  ]);

  await delay(1000);

  const cid = CID.parse("QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL");
  await node1.contentRouting.provide(cid);
  console.log(`node1: ${node1.peerId.toString()}`)

  await delay(300);

  const abortController = new AbortController()
  const providers = await all(node3.contentRouting.findProviders(cid, { signal: abortController.signal }));

  await delay(1000);
  abortController.abort();

  console.log('Found provider:', providers[0].id.toString()); // Expected to be node1
  process.exit();
})();


