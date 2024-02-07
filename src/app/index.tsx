import { CategoryButton } from "@/components/category_button";
import { Header } from "@/components/header";
import { View, FlatList } from "react-native";
import { CATEGORIES } from "@/utils/data/products";
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState(CATEGORIES[0]);

  function handleCategorySelect(selecedCategory: string) {
    setCategory(selecedCategory);
  }

  return (
    <View className="flex 1 pt-8">
      <Header title="Faça seu pedido" cartQuantityItems={5} />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        className="max-h-10 mt-5"
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
