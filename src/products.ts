export type Product = {
  id: number;
  name: string;
  price: number;
  imageURL: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Bianchi Oltre Rival Etap AXS kolo, celeste",
    price: 164999,
    imageURL:
      "https://images.mtbiker.sk/eshop/big/220997-bianchi-oltre-rival-etap-axs-bicykel-celeste-1691389637_64d08ec57f575.jpg",
  },
  {
    id: 2,
    name: "Pinarello F9 Disc Dura Ace Di2 kolo, černé/bílé",
    price: 293999,
    imageURL:
      "https://images.mtbiker.sk/eshop/big/235400-pinarello-f9-dura-ace-di2-bicykel-cierna-biela-1691739038_64d5e39ebe203.png",
  },
  {
    id: 3,
    name: "BMC Teammachine SLR SIX kolo, neon red/black",
    price: 66699,
    imageURL:
      "https://images.mtbiker.sk/eshop/big/237592-bmc-teammachine-slr-six-bicykel-neon-red-black-1693385077_64ef017577038.jpg",
  },
  {
    id: 4,
    name: "Pinarello X3 Disc 105 Di2 Fulcrum Racing 800 DB 28 kolo, Deep Black",
    price: 162999,
    imageURL:
      "https://images.mtbiker.sk/eshop/big/216859-pinarello-x3-disc-105-di2-fulcrum-racing-800-db-a27da200acd51d7bc08c1038566767b7.jpg",
  },
  {
    id: 5,
    name: "Giant TCR Advanced Pro 1 Disc Di2 kolo, aged denim",
    price: 293999,
    imageURL:
      "https://images.mtbiker.sk/eshop/big/235375-giant-tcr-advanced-pro-1-disc-di2-ml-aged-denim-model-0dadede7bfa2cffcc7a080b9c565ae9e.jpg",
  },
];
