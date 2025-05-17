const salesContract: any = {
  title: "TIDELLI MIAMI, LLC SALES CONTRACT",
  preamble: "By this private instrument of contract, the above-mentioned parties, as previously qualified, mutually agree and establish the following:",
  sections: {
    I_PURCHASE: {
      heading: "PURCHASE",
      clauses: {
        1: {
          description: "At the moment of confirming the acquisition of the products and issuing the Sales Order, the BUYER must expressly verify:",
          items: [
            "The locations where the products will be placed",
            "The width of the doors of the property for the access of the PRODUCTS",
            "The width of the hallways, elevator stairs for access to the property where the PRODUCTS will be placed",
            "The selection of the date and delivery time of the products, as stated in Clause III - DELIVERY",
            "Hoisting at the customer's expense"
          ]
        },
        2: "The BUYER may precisely define the type of PRODUCT and its respective dimensions, avoiding the risk of its unsuitability, assisted by the representative of the SELLER.",
        3: "After issuance of the Sales Order, the BUYER is prohibited from making changes except with prior and full authorization of the SELLER.",
        4: {
          text: "Optional changes to measurements and specifications if theoretically feasible and authorized, defining a special order.",
          subclause: {
            "4.1": "Any alteration made will result in additional cost, not covered by normal sales tables."
          }
        }
      }
    },
    II_CANCELLATION: {
      heading: "CANCELLATION",
      clauses: {
        5: "Buyer prohibited from altering the Sales Order without prior written authorization of the SELLER.",
        "5.1": "Any authorized modification does not novate the contract; withdrawal before industrialization incurs 30% penalty of total order value.",
        6: "Contract is irrevocable and non-negotiable; cancellation by BUYER not permitted."
      }
    },
    III_DELIVERY: {
      heading: "DELIVERY",
      clauses: {
        7: {
          description: "SELLER transfers PRODUCTS to transport company; BUYER to receive and photograph on delivery:",
          subclauses: {
            "7.1": "All PRODUCTS must be inspected at delivery for damage or discrepancies as per clause 14."
          },
          note: "Buyer chooses delivery time at contracting."
        },
        "8": {
          description: "SELLER not responsible for deliveries to inaccessible locations due to lack of prior verification:",
          subclauses: {
            "8.1": "SELLER may deliver to accessible location; BUYER responsible for final placement.",
            "8.2": "Hoisting must be arranged and paid by BUYER.",
            "8.3": "Damage from incompatibility is BUYER's responsibility.",
            "8.4": "Assembly fee if assembly impossible within 100 miles radius.",
            "8.5": "Using affiliated carriers, assembly at delivery or fee equal to freight cost."
          }
        },
        "9": {
          description: "Deliveries beyond 100 miles from SELLER's municipality are at BUYER's cost:",
          subclauses: {
            "9.1": "Damage in transit is BUYER's responsibility.",
            "9.2": "Refer to clause 13 for defect reporting.",
            "9.3": "Defect does not allow cancellation, refund, or replacement request."
          }
        },
        "10": {
          description: "SELLER contacts BUYER two business days in advance to confirm delivery; presence required:",
          subclauses: {
            "10.1": "SELLER not responsible for delays due to BUYER scheduling issues.",
            "10.2": "Refusal at delivery incurs storage fees as per clause 17."
          }
        },
        11: "SELLER may deliver in installments; delays due to force majeure not breach of contract.",
        12: "In force majeure, SELLER will define new deadlines with BUYER."
      }
    },
    IV_WARRANTY: {
      heading: "WARRANTY",
      text: "SELLER offers up to 36 months warranty from date of receipt against manufacturing/assembly defects."
    },
    V_DEFECTS: {
      heading: "DEFECTS",
      clauses: {
        13: "BUYER must immediately notify SELLER's delivery team of defects for repair.",
        "13.1": "SELLER to repair on-site within 120 days as needed.",
        "13.2": "If on-site repair impossible, SEND to Technical Assistance, inform BUYER within period or replace.",
        "13.3": "Replacement/refund subject to compliance with 13.1 and 13.2.",
        "13.4": "SELLER may replace defective with identical product.",
        "13.5": "If replacement with identical not possible, BUYER may choose different product, and differences settled immediately."
      }
    },
    VI_PAYMENTS: {
      heading: "PAYMENTS",
      clauses: {
        14: "Payment for products and services as per Sales Order.",
        15: "Installment payments due on agreed dates regardless of delivery.",
        16: "Late installments incur fines and interest adjusted by prevailing index.",
        "16.1": "Delay over 5 days allows SELLER to terminate contract or enforce performance; contract is extrajudicial executive title."
      }
    },
    VII_STORAGE: {
      heading: "STORAGE",
      clauses: {
        17: "SELLER stores PRODUCTS free for 5 days after delivery period; then notifies BUYER to schedule pickup.",
        "17.1": "No response authorizes storage company forwarding with 3% monthly fee.",
        "17.2": "Stored PRODUCTS covered by insurance.",
        "17.3": "Storage fee billed by storage company from receipt date.",
        "17.4": "BUYER notifies to suspend storage services and schedule delivery/assembly."
      }
    },
    VIII_GENERAL: {
      heading: "GENERAL CONSIDERATIONS",
      clauses: {
        18: {
          description: "BUYER may supply fabric subject to SELLER's approval:",
          subclauses: {
            "18.1": "Fabric delivery within 8 days of Sales Order.",
            "18.2": "Additional fabric needed delivered within 8 days of request.",
            "18.3": "Delivery period subject to 18.1 and 18.2.",
            "18.4": "Late fabric postpones delivery and price adjustment applies.",
            "18.5": "BUYER responsible for damage due to supplied fabric quality.",
            "18.6": "Delivery period starts 7 days after outstanding issue resolution."
          }
        },
        19: "PRODUCTS delivered as specified, with natural material variations not defects.",
        "19.1": "Variations in natural materials not considered defects.",
        20: "Warranties as per user manuals; post-warranty technical assistance available with estimate and service fee.",
        "20.1": "Service fee deductible from approved estimate.",
        21: "BUYER authorizes SELLER to transfer contract rights without prior notice.",
        22: "Contract governed by laws of the State of Florida; constitutes entire agreement."
      }
    }
  },
  signatures: [
    { party: "TIDELLI MIAMI, LLC", signature: "________________" },
    { party: "Client", signature: "_______________" }
  ],
  dateLine: "City, Date"
};

export default salesContract;