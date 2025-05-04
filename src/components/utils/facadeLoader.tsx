function FacadeLoader() : object[] {


    const facadesItems = JSON.parse(localStorage.getItem('facades') || '[]');

    

    return facadesItems
}

export default FacadeLoader