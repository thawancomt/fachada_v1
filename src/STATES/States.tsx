const VALID_STATES_VALUES =
    {
        "pending" : "Pendente",
        "approved" : "Aprovado",
        "rejected" : "Rejeitado",
        "delivered" : "Entregue",
    };

type VALID_STATES = keyof typeof VALID_STATES_VALUES;
const VALID_STATES_OBJECT = Object.keys(VALID_STATES_VALUES) as VALID_STATES[];

export default VALID_STATES;
export { VALID_STATES_OBJECT, VALID_STATES_VALUES };