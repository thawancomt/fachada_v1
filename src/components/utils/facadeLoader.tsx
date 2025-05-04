function FacadeLoader() : object[] {


    const facadesItems = JSON.parse(localStorage.getItem('facades') || '[]');

    console.log("facadesItems", facadesItems);
    

    return facadesItems
}

export default FacadeLoader