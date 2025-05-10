This componente need to be modular and flexible.


We assumes this component is part of a grid made up of similar components.

We refers to this grid as "Fachadas" and each individual "Fachadas" has a grid of Segment component.

Each segmente on the grid need to be able to save it state and it notes and call grid functions, like 
apply an modification on the entire line, or something like that.

So the core functionalities of this component is:
    Receive the "Fachada" name of this component belongs to.
    receive the respective cordinates like, X and Y.
    Receive an DBmanager that work like an ORM.
    The operations that DBmanager need to supply is:
        - Set Weight and Height of the segment
        - Set status
        - Set note
        - Set setting for all Axis X or Y
    
    The DBmanager must handle all operations about related to  localStorage, and provide a way to
    export the data to a JSON file.
