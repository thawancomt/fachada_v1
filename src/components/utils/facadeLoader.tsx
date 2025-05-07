function FacadeLoader() : Record<string, any> {


    const facadesItems = JSON.parse(localStorage.getItem('facades') || '[]');

    

    return facadesItems
}

export default FacadeLoader