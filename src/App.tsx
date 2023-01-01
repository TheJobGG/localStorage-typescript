import React, { useState } from 'react'
import './App.css'


export default function App() {

  // Nombre de la variable en localStorage
  const storageName = 'itemsV2';

  // Leemos el contenido de localStorage y lo convertimos a un array de strings
  const listItems: string[] = JSON.parse(localStorage.getItem(storageName)!) ?? [];;

  // Asignamos el contenido al useState para manejar el content en la app
  const [items, setItems] = useState<string[]>(listItems);


  // Método para manejar el submit del input
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevenimos que al hacer submit recargue la página el elemento form
    event.preventDefault();

    // Obtenemos el valor del input
    // @ts-ignore
    let input: HTMLInputElement = document.getElementById('input-item');
    let value: string = input.value;

    // Checamos si hay algo en value, de lo contrario no hacemos nada
    if (!input.value.trim()) return;

    try {
      // si el item ya existe se omite
      if (items.includes(value)) return;


      // Adjuntamos el valor entrante con el resto de datos los items en el array de strings
      setItems([...items, value])

      /*  ----  */
      // Ahora guardamos los valores en localStorage para persistir la información

      // Primero leemos el contenido de la variable en localStorage
      const lsItems: string[] = JSON.parse(localStorage.getItem(storageName)!) ?? [];

      // Insertamos el valor en el array
      lsItems.push(value)

      // Actualizamos el valor de la variable en localStorage en forma de string con JSON.stringify
      localStorage.setItem(storageName, JSON.stringify(lsItems))


      event.currentTarget.reset();

    } catch (error) {
      console.error(error);
    }
  }

  const deleteItem = (textItem: string) => {

    const filterItems: string[] = items.filter(item => item != textItem)
    setItems(filterItems)


    let lsItems: string[] = JSON.parse(localStorage.getItem(storageName)!) ?? [];
    lsItems = filterItems;
    localStorage.setItem(storageName, JSON.stringify(lsItems))

    console.log('Deleted item => ', textItem);
  }

  const confirmClearList = () => {
    document.querySelector('.confirm-or-return')?.classList.remove('hide')
    document.getElementById('confirm-btn')?.classList.add('hide')
  }

  const cancelClearList = () => {
    document.querySelector('.confirm-or-return')?.classList.add('hide')
    document.getElementById('confirm-btn')?.classList.remove('hide')
  }

  const clearList = () => {
    setItems([])

    let lsItems: string[] = JSON.parse(localStorage.getItem(storageName)!) ?? [];
    lsItems = []
    localStorage.setItem(storageName, JSON.stringify(lsItems))
  }

  return (
    <div className='app'>
      <h1 style={{textAlign: 'center'}}>List items</h1>
      <form onSubmit={onSubmitForm}>
        <input type="text" placeholder='...' id='input-item' required />
        <input type="submit" value="Save element" id='submit-btn' />
      </form>

      <div className="items-container">
        <ul className="items">
          {
            items.length != 0 ?
              <fieldset>
                <legend>Items saved</legend>
                <ul>
                  {
                    items.map((item, index) => (
                      <li
                        onClick={() => deleteItem(item)}
                        key={index}
                        style={{ cursor: 'pointer' }}
                      >
                        {item}
                      </li>
                    ))
                  }
                </ul>
              </fieldset>
              : <i>Insert some value...</i>
          }
        </ul>
        {
          items.length != 0
            ? <div className='clear-section'>
              <input type="button" value="Clear list" id='confirm-btn' onClick={confirmClearList} />

              <div className={`confirm-or-return hide`}>
                <input type="button" value="Proceed to clear list" id='clear-btn' onClick={clearList} />
                <input type="button" value="Cancel and return" id='cancel-btn' onClick={cancelClearList} />
              </div>
              <span>Or just click over some element to delete it</span>
            </div>
            : null
        }
      </div>
    </div>
  )
}
