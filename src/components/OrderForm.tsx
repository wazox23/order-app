import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { products, Product } from "../products";

import "../styles/OrderForm.scss";

type KurzyResponse = {
  banka: string;
  kurzy: Rate[];
};

type Rate = {
  kod: string;
  nazev: string;
  jednotka: number;
  dev_stred: number;
};

type FormData = {
  name: string;
  surname: string;
  product: number;
  quantity: number;
};

const schema = yup.object().shape({
  name: yup.string().required("Jméno je povinné"),
  surname: yup.string().required("Příjmení je povinné"),
  product: yup
    .number()
    .required("Produkt je povinný")
    .test("is-valid-product", "Vyberte platný produkt", (value) => {
      return products.some(
        (product) => product.id === value && value >= 1 && value <= 5
      );
    }),
  quantity: yup
    .number()
    .min(1, "Počet kusů musí být větší než 0")
    .required("Počet kusů je povinný"),
});

export default function OrderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("CZK");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [product, setProduct] = useState<number | null>(null);
  const [prevCurrency, setPrevCurrency] = useState<string>("");
  const [pricePerPiece, setPricePerPiece] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [exchangeRates, setExchangeRates] = useState<Rate[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<KurzyResponse>(
          "https://data.kurzy.cz/json/meny/b6.json"
        );
        const data = response.data;

        const ratesArray = Object.values(data.kurzy);
        setExchangeRates(ratesArray);
        const initialCurrency = ratesArray.find(
          (rate: Rate) => rate.nazev === "CZK"
        );
        if (initialCurrency) {
          setExchangeRate(initialCurrency.dev_stred);
        }
      } catch (error) {
        console.error("Chyba při načítání kurzovního lístku:", error);
      }
    };

    fetchData();
  }, []);

  function roundToTwoDecimals(value: number): number {
    return parseFloat(value.toFixed(2));
  }
  const onSubmit: SubmitHandler<FormData> = (data) => {
    setName(data.name);
    setSurname(data.surname);
    setProduct(data.product);
    setQuantity(data.quantity);

    if (selectedProduct) {
      const calculatedTotalPrice = selectedProduct.price * data.quantity;
      setTotalPrice(roundToTwoDecimals(calculatedTotalPrice));
    }
    setIsSubmitted(true);
    console.log(onSubmit);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
    if (e.target.value === "CZK") {
      setExchangeRate(1);
    } else {
      const selectedRate = exchangeRates.find(
        (rate) => rate.nazev === e.target.value
      );
      if (selectedRate) {
        setExchangeRate(1 / selectedRate.dev_stred);
      }
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      setPricePerPiece(selectedProduct.price);
    }
  }, [selectedProduct]);

  const toggleCurrency = () => {
    if (selectedCurrency === "CZK") {
      const selectedRate = exchangeRates.find(
        (rate) => rate.nazev === prevCurrency
      );
      if (selectedRate) {
        setExchangeRate(1 / selectedRate.dev_stred);
        setSelectedCurrency(prevCurrency);
      }
    } else {
      setPrevCurrency(selectedCurrency);
      setSelectedCurrency("CZK");
      setExchangeRate(1);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="form-group">
          <label>Jméno:</label>
          <input {...register("name")} className="form-control" />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <label>Příjmení:</label>
          <input {...register("surname")} className="form-control" />
          {errors.surname && (
            <p className="text-danger">{errors.surname.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Výběr produktu:</label>
          <select
            className="form-control"
            {...register("product")}
            onChange={(e) => {
              const chosenProduct = products.find(
                (product) => product.id === Number(e.target.value)
              );
              setSelectedProduct(chosenProduct || null);
            }}
          >
            <option value="">-- Vyberte produkt --</option>
            {products.map((product, index) => (
              <option key={index} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        {selectedProduct && (
          <div className="form-group">
            <label>Aktuální cena za kus:</label>
            <p>{selectedProduct.price} CZK</p>
          </div>
        )}
        <div className="form-group">
          <label>Počet kusů:</label>
          <input
            type="number"
            {...register("quantity")}
            className="form-control"
          />
          {errors.quantity && (
            <p className="text-danger">{errors.quantity.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Odeslat
        </button>
      </form>
      {isSubmitted && (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h2 className="text-center">Rekapitulace objednávky</h2>
          <p>Jméno: {name}</p>
          <p>Příjmení: {surname}</p>
          <p>
            Produkt:{" "}
            {products.find((p) => p.id === product)?.name || "Neznámý produkt"}
          </p>
          {selectedProduct && (
            <div>
              <img
                src={selectedProduct.imageURL}
                alt={selectedProduct.name}
                style={{ width: "400px" }}
              />
            </div>
          )}
          <p>Počet kusů: {quantity}</p>

          <div className="form-group">
            <label>Převod na jinou měnu:</label>

            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="form-control"
            >
              <option value="">-- Vyberte měnu --</option>
              {exchangeRates &&
                exchangeRates.map((rate, index) => (
                  <option key={index} value={rate.nazev}>
                    {rate.nazev}
                  </option>
                ))}
            </select>
          </div>
          <div className="toggle-switch mb-5">
            <input
              type="checkbox"
              id="currencySwitch"
              className="toggle-switch-checkbox"
              onChange={toggleCurrency}
            />
            <label className="toggle-switch-label" htmlFor="currencySwitch">
              <span className="toggle-switch-inner" />
              <span className="toggle-switch-switch" />
            </label>
          </div>
          <p>
            Celková cena (bez DPH):{" "}
            {roundToTwoDecimals(totalPrice * exchangeRate)} {selectedCurrency}
          </p>
          <p>
            Celková cena (včetně DPH):{" "}
            {roundToTwoDecimals(totalPrice * 1.21 * exchangeRate)}{" "}
            {selectedCurrency}
          </p>
        </div>
      )}
    </div>
  );
}
