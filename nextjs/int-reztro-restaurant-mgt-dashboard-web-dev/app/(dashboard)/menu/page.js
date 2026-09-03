"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

import { FaSearch } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";

import MenuFilter from "@/components/menus/MenuFilters";
import MenuPagination from "@/components/menus/MenuPagination";
import ShowingPagination from "@/components/menus/showingPagination";
import RatingStars from "@/components/menus/RetingStars";
import Link from "next/link";
import { Plus } from "react-bootstrap-icons";
import { menuService } from "@/services/menuService";

const perPageOptions = [6, 9, 12];

const priceRanges = [
  { id: 1, label: "$0 - $10", min: 0, max: 10 },
  { id: 2, label: "$11 - $20", min: 11, max: 20 },
  { id: 3, label: "$21 - $30", min: 21, max: 30 },
  { id: 4, label: "$31+", min: 31, max: null },
];

const ratings = [
  { id: 5, label: "5 Star", value: 5 },
  { id: 4, label: "4 Star", value: 4 },
  { id: 3, label: "3 Star", value: 3 },
  { id: 2, label: "2 Star", value: 2 },
  { id: 1, label: "1 Star", value: 1 },
];

export default function MenuPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [selectedMealTimes, setSelectedMealTimes] = useState(["All"]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedPromos, setSelectedPromos] = useState(["All Promo"]);
  const [sortBy, setSortBy] = useState("Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [showFilter, setShowFilter] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [dbPromotions, setDbPromotions] = useState([]);
  const [dbMealTimes, setDbMealTimes] = useState([]);

  useEffect(() => {
    const handleResponsiveItems = () => {
      const width = window.innerWidth;
      if (width < 1200) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(9);
      }
    };

    handleResponsiveItems();
    window.addEventListener("resize", handleResponsiveItems);
    return () => window.removeEventListener("resize", handleResponsiveItems);
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setMenuLoading(true);
        const response = await menuService.getMenuItems();
        const data =
          response?.data?.data ||
          response?.data?.menu_items ||
          response?.data ||
          response?.menu_items ||
          response ||
          [];

        const formattedData = Array.isArray(data)
          ? data.map((item) => ({
            id: item.menu_id || item.id,
            name: item.name || "",
            category: item.category_name || item.category || "",

            mealTime:
              item.meal_times?.map((m) => m.meal_time_name).join(", ") ||
              item.meal_time_name ||
              "",

            price: Number(item.price || 0),
            rating: Number(item.rating || 0),
            image: item.image_url || "",

            tags: item.tags?.map((t) => t.tag_name) || [],

            promotions:
              item.promotions?.map((p) => p.promotion_title) || [],
          }))
          : [];

        setMenuItems(formattedData);
      } catch (error) {
        console.log(error.message || "Failed to fetch menu items");
      } finally {
        setMenuLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await menuService.getMenuCategories();
        const data = response?.data?.data || response?.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error.message || "Failed to fetch menu categories");
        setCategories([]);
      }
    };

    const fetchMealTimes = async () => {
      try {
        const response = await menuService.getMealTimes();
        const data = response?.data?.data || response?.data || [];
        setDbMealTimes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Failed to fetch meal times", error);
      }
    };

    const fetchPromotions = async () => {
      try {
        const response = await menuService.getPromotions();
        const data = response?.data || response?.data?.data || [];
        setDbPromotions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Failed to fetch promotions", error);
      }
    };

    fetchMenuItems();
    fetchCategories();
    fetchMealTimes();
    fetchPromotions();
  }, []);

  const resetFilters = () => {
    setSelectedCategories(["All"]);
    setSelectedMealTimes(["All"]);
    setSelectedPrices([]);
    setSelectedRatings([]);
    setSelectedPromos(["All Promo"]);
    setSearchText("");
    setCurrentPage(1);
  };

  const toggleFilter = (value, selectedValues, setSelectedValues, hasAll = false) => {
    setCurrentPage(1);

    if (hasAll && (value === "All" || value === "All Promo")) {
      setSelectedValues([value]);
      return;
    }

    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [
        ...selectedValues.filter(
          (item) => item !== "All" && item !== "All Promo"
        ),
        value,
      ];

    if (hasAll && updatedValues.length === 0) {
      setSelectedValues(value === "All Promo" ? ["All Promo"] : ["All"]);
      return;
    }

    setSelectedValues(updatedValues);
  };

  const dynamicMenuFilters = useMemo(() => {
    const activeCategories = categories
      .filter((cat) => cat.is_active === true)
      .map((cat) => cat.category_name || cat.name || "");

    const categoryList = [...new Set(activeCategories)].filter(Boolean).map((item, index) => ({
      id: index + 1,
      name: item,
      label: item,
      value: item,
    }));

    const activeMealTimes = dbMealTimes
      .filter((m) => m.is_active !== false)
      .map((m) => m.meal_time_name || m.name || "");

    const mealTimeList = [...new Set(activeMealTimes)].filter(Boolean).map((item, index) => ({
      id: index + 1,
      name: item,
      label: item,
      value: item,
    }));

    const activePromos = dbPromotions
      .filter((p) => p.is_active !== false)
      .map((p) => p.promotion_title || p.promotion_code || "");

    const promoList = [...new Set(activePromos)].filter(Boolean).map((item, index) => ({
      id: index + 1,
      name: item,
      label: item,
      value: item,
    }));

    return {
      categories: [
        { id: 0, name: "All", label: "All", value: "All" },
        ...categoryList,
      ],
      mealTimes: [
        { id: 0, name: "All", label: "All", value: "All" },
        ...mealTimeList,
      ],
      priceRanges,
      ratings,
      promos: [
        { id: 0, name: "All Promo", label: "All Promo", value: "All Promo" },
        ...promoList,
      ],
    };
  }, [categories, dbMealTimes, dbPromotions]);

  const filteredMenu = useMemo(() => {
    let result = [...menuItems];

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(keyword) ||
          item.category?.toLowerCase().includes(keyword) ||
          item.mealTime?.toLowerCase().includes(keyword)
      );
    }

    if (!selectedCategories.includes("All")) {
      result = result.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    if (!selectedMealTimes.includes("All")) {
      result = result.filter((item) =>
        selectedMealTimes.includes(item.mealTime)
      );
    }

    if (selectedPrices.length > 0) {
      result = result.filter((item) =>
        selectedPrices.some((label) => {
          const range = priceRanges.find((price) => price.label === label);
          if (!range) return false;
          if (range.max === null) return item.price > range.min;
          return item.price >= range.min && item.price <= range.max;
        })
      );
    }

    if (selectedRatings.length > 0) {
      result = result.filter((item) =>
        selectedRatings.some((rating) => {
          const minRating = Number(rating);
          const maxRating = minRating + 1;
          return item.rating >= minRating && item.rating < maxRating;
        })
      );
    }

    if (selectedPromos.length > 0 && !selectedPromos.includes("All Promo")) {
      result = result.filter((item) =>
        selectedPromos.some((promo) => item.promos?.includes(promo))
      );
    }

    if (sortBy === "Popular") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "Newest") result.sort((a, b) => b.id - a.id);
    if (sortBy === "Low Price") result.sort((a, b) => a.price - b.price);
    if (sortBy === "High Price") result.sort((a, b) => b.price - a.price);

    return result;
  }, [
    menuItems,
    searchText,
    selectedCategories,
    selectedMealTimes,
    selectedPrices,
    selectedRatings,
    selectedPromos,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredMenu.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedMenu = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMenu.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMenu, currentPage, itemsPerPage]);

  const filterContent = (
    <MenuFilter
      menuFilters={dynamicMenuFilters}
      selectedCategories={selectedCategories}
      selectedMealTimes={selectedMealTimes}
      selectedPrices={selectedPrices}
      selectedRatings={selectedRatings}
      selectedPromos={selectedPromos}
      onResetFilters={resetFilters}
      onCategoryChange={(value) =>
        toggleFilter(value, selectedCategories, setSelectedCategories, true)
      }
      onMealTimeChange={(value) =>
        toggleFilter(value, selectedMealTimes, setSelectedMealTimes, true)
      }
      onPriceChange={(value) =>
        toggleFilter(value, selectedPrices, setSelectedPrices)
      }
      onRatingChange={(value) =>
        toggleFilter(value, selectedRatings, setSelectedRatings)
      }
      onPromoChange={(value) =>
        toggleFilter(value, selectedPromos, setSelectedPromos, true)
      }
    />
  );

  return (
    <Container fluid className="menu-page p-0">
      <Row className="g-4">
        <Col xs={12} md={4} xl={3} className="filter-sidebar-col">
          {filterContent}
        </Col>

        <Col xs={12} md={8} xl={9}>
          <Card className="menu-content-card border-0 rounded-4 bg-white h-100 d-flex flex-column">
            <Card.Header className="bg-white border-0 p-3">
              <Row className="g-3 align-items-center justify-content-between ">
                <Col xs={12} xl={6}>
                  <div className="d-flex align-items-center gap-2">
                    <InputGroup className="search-box border p-1 rounded-4">
                      <InputGroup.Text className="bg-light border-0">
                        <FaSearch size={12} />
                      </InputGroup.Text>
                      <Form.Control
                        className="bg-light shadow-none border-0"
                        placeholder="Search for menu"
                        value={searchText}
                        onChange={(event) => {
                          setSearchText(event.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      <Button variant="primary" className="rounded-4 text-white">
                        Search
                      </Button>
                    </InputGroup>
                    <Button
                      type="button"
                      variant="light"
                      className="mobile-filter-btn"
                      onClick={() => setShowFilter((prev) => !prev)}
                      aria-label="Toggle filters"
                    >
                      <BiFilterAlt />
                    </Button>
                  </div>
                </Col>

                <Col xs={12} xl={5}>
                  <div className="d-flex align-items-center justify-content-between justify-content-xl-end gap-1 flex-wrap">
                    <div className="d-flex align-items-center gap-1">
                      <span className="sort-label text-nowrap">Sort by:</span>
                      <Form.Select
                        className="sort-select flex-shrink-0"
                        value={sortBy}
                        onChange={(event) => {
                          setSortBy(event.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="Popular">Popular</option>
                        <option value="Newest">Newest</option>
                        <option value="Low Price">Low Price</option>
                        <option value="High Price">High Price</option>
                      </Form.Select>
                    </div>
                    <div>
                      <Link href="/menu/add" className="add-menu-btn text-decoration-none flex-shrink-0">
                       Add Menu
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Header>

            {showFilter && (
              <div className="mobile-filter-popup d-md-none">
                <div className="mobile-filter-backdrop" onClick={() => setShowFilter(false)} />
                <div className="mobile-filter-content">
                  <button
                    type="button"
                    className="mobile-filter-close"
                    onClick={() => setShowFilter(false)}
                    aria-label="Close filters"
                  >
                    ×
                  </button>
                  {filterContent}
                </div>
              </div>
            )}

            <Card.Body className="p-3 flex-grow-1">
              {menuLoading ? (
                <Card className="border-0 rounded-4 bg-white h-100">
                  <Card.Body className="min-empty d-flex flex-column align-items-center justify-content-center text-center">
                    <h5>Loading menu items...</h5>
                  </Card.Body>
                </Card>
              ) : paginatedMenu.length > 0 ? (
                <Row className="g-4">
                  {paginatedMenu.map((item) => {
                    return (
                      <Col xs={6} md={6} xl={4} xxl={4} key={item.id}>
                        <Link href={`/menu/menuDetails?id=${item.id}`} className="text-decoration-none" prefetch={false}>
                          <Card className="menu-item-card border-0 h-100 d-flex flex-column">
                            <div className="menu-item-img-wrap">
                              {item.image ? (
                                <Card.Img variant="top" src={item.image} alt={item.name} className="menu-item-img" />
                              ) : (
                                <div className="menu-item-img-placeholder" />
                              )}
                              {/* Tags */}
                              {item.tags?.map((tag, index) => (
                                <Badge
                                  key={`tag-${index}`}
                                  bg="primary"
                                  className="menu-item-badge me-1"
                                >
                                  {tag}
                                </Badge>
                              ))}

                              {/* Promotions */}
                              {item.promotions?.map((promotion, index) => (
                                <Badge
                                  key={`promotion-${index}`}
                                  bg="danger"
                                  className="menu-item-badge me-1"
                                >
                                  {promotion}
                                </Badge>
                              ))}
                            </div>
                            <Card.Body className="menu-item-body d-flex flex-column justify-content-evenly flex-grow-1">
                              <div>
                                <Card.Title className="menu-item-title">{item.name}</Card.Title>
                                <Card.Text className="menu-item-category">{item.category}</Card.Text>
                              </div>
                              <div className="menu-item-footer d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <span className="rating-desktop">
                                    <RatingStars rating={item.rating} />
                                  </span>
                                  <span className="rating-mobile">
                                    <RatingStars rating={1} showEmpty={false} size={12} />
                                  </span>
                                  <span className="menu-item-rating-value ms-1">{item.rating}</span>
                                </div>
                                <strong className="menu-item-price">${Number(item.price || 0).toFixed(2)}</strong>
                              </div>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <Card className="border-0 rounded-4 bg-white h-100">
                  <Card.Body className="min-empty d-flex flex-column align-items-center justify-content-center text-center">
                    <h5>No menu item found</h5>
                    <p className="text-muted mb-0">Try changing the filters or search keywords.</p>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>

            <Card.Footer className="bg-white border-0 p-3 mt-auto">
              <div className="menu-footer-pagination d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="d-none d-xl-block">
                  <ShowingPagination
                    totalItems={filteredMenu.length}
                    itemsPerPage={itemsPerPage}
                    options={perPageOptions}
                    onItemsPerPageChange={(value) => {
                      setItemsPerPage(value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <MenuPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                />
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}