import { Header } from "@/components/header";
import { Alert, ScrollView, Text, View, Linking } from "react-native";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currancy";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

export default function Cart() {
  const cartStore = useCartStore();
  const navigation = useNavigation();
  const [address, setAddress] = useState("");

  const number = "+5591955555555";

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      },
    ]);
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Atenção", "Informe os dados da entrega.");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

    const message = `
        🍴 NOVO PEDIDO 🍴
        \n Entregar em: ${address}
        ${products}

        \n Valor total: ${total}
      `;

    Linking.openURL(
      `https://api.whatsapp.com/send?phone=${number}&text=${message}`
    );
    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      {cartStore.products.length > 0 ? (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          extraHeight={100}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="p-5 flex-1">
              {cartStore.products.map((product) => (
                <Product
                  key={product.id}
                  data={product}
                  onPress={() => handleProductRemove(product)}
                />
              ))}
              <View className="border-b border-slate-700"></View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      ) : (
        <Text className="font_body text-slate-400 text-center my-8">
          Seu carrinho está vazio.
        </Text>
      )}

      <View className="ml-6 mr-6 mb-4">
        <View className="flex-row gap-2 items-center mt-5 mb-3">
          <Text className="text-white text-xl font-subtitle">Total:</Text>
          <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
        </View>
        <Input
          placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento"
          onChangeText={setAddress}
          blurOnSubmit={true}
          onSubmitEditing={handleOrder}
          returnKeyType="next"
        />
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton className="mt-4" title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
