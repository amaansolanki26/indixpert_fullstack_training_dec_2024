"use client";

import { Tabs, Tab } from "react-bootstrap";
import CategoryTab from "@/components/menu-master/CategoryTab";
import TagTab from "@/components/menu-master/TagTab";
import MealTimeTab from "@/components/menu-master/MealTimeTab";
import PromotionTab from "@/components/menu-master/PromotionTab";
import InventoryCategoryTab from "@/components/menu-master/InventoryCategoryTab";

export default function MasterDataPage() {
  return (
    <div className="py-4">

      <Tabs defaultActiveKey="categories" className="mb-3">

        <Tab eventKey="categories" title="Categories">
          <CategoryTab />
        </Tab>

        <Tab eventKey="inventory-categories" title="Inventory Categories">
          <InventoryCategoryTab />
        </Tab>

        <Tab eventKey="tags" title="Tags">
          <TagTab />
        </Tab>

        <Tab eventKey="meal-times" title="Meal Times">
          <MealTimeTab />
        </Tab>

        <Tab eventKey="promotions" title="Promotions">
          <PromotionTab />
        </Tab>

      </Tabs>
    </div>
  );
}