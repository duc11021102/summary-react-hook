import React, {  useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const initialIngredientslState = [];
const initialHttpState = { loading: false, error: null };
const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id)
    default:
      throw new Error('Should not get there')
  }
}
const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...currHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return { ...currHttpState, error: null }
    default:
      throw new Error('Should not get there')
  }
}

const Ingredients = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, initialIngredientslState);
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialHttpState);

  // useCallback giúp tạo lại hàm chỉ khi cần thiết và giữ nó không thay đổi giữa các lần re-render.
  // mỗi lần component thay đổi thì sẽ tạo lại hàm và chạy lại hàm từ đầu điều này sẽ không cần thiết nên sẽ sử dụng useCallback
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, []);

  const onAddIngredientHandler = (ingredient) => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' })
    fetch(
      "https://react-hook-80098-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' })

        return response.json();
      })
      .then((responseData) => {
        dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
      });
  };
  const onRemoveItemHandler = (id) => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' })
    fetch(`https://react-hook-80098-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then((response) => {
      // setIsLoading(false);
      dispatchHttp({ type: 'RESPONSE' })
      dispatch({ type: 'DELETE', id: id })
    }).catch((error) => {
      // setError('Something went wrong');
      dispatchHttp({ type: 'ERROR', errorMessage: "Something went wrong" })

    })
  };
  const onCloseHandler = () => {
    // setError(null);
    // setIsLoading(false);
    dispatchHttp({type: 'CLEAR'})
  }
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={onCloseHandler}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={onAddIngredientHandler} isLoading={httpState.loading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          onRemoveItem={onRemoveItemHandler}
          ingredients={userIngredients}
        />
      </section>
    </div>
  );
}

export default Ingredients;
