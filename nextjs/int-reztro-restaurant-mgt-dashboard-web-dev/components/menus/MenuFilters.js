"use client";

import React from "react";
import { Accordion, Button, Card, Col, Form, Row } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import RatingStars from "@/components/menus/RetingStars";

export default function MenuFilter({
  menuFilters,
  selectedCategories,
  selectedMealTimes,
  selectedPrices,
  selectedRatings,
  selectedPromos,
  onCategoryChange,
  onMealTimeChange,
  onPriceChange,
  onRatingChange,
  onPromoChange,
  onResetFilters,
}) {
  return (
    <Card className="menu-filter border-0 rounded-4 bg-white h-100">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="fw-bold mb-0 fs-16">Filter</p>
          <Button
            type="button"
            variant="link"
            className="filter-dot-btn p-0 text-muted text-decoration-none"
            onClick={onResetFilters}
            aria-label="Reset filters"
          >
            <BsThreeDots />
          </Button>
        </div>

        <Accordion
          defaultActiveKey={["0", "1", "2", "3", "4"]}
          alwaysOpen
          flush
          className="filter-accordion"
        >
          {/* CATEGORY ACCORDION */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Category</Accordion.Header>
            <Accordion.Body>
              <Row className="g-2">
                {menuFilters.categories.map((category, index) => {
                  const categoryName =
                    category.name ||
                    category.category_name ||
                    category.label ||
                    category;
                  return (
                    <Col xs={6} key={`category-${categoryName}-${index}`}>
                      <Form.Check
                        type="checkbox"
                        id={`category-${categoryName}-${index}`}
                        label={categoryName}
                        checked={selectedCategories.includes(categoryName)}
                        onChange={() => onCategoryChange(categoryName)}
                        className="filter-check"
                      />
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          {/* MEAL TIMES ACCORDION */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Meal Times</Accordion.Header>
            <Accordion.Body>
              <Row className="g-2">
                {menuFilters.mealTimes.map((time, index) => {
                  const timeName = time.name || time.label || time;
                  return (
                    <Col xs={6} key={`time-${timeName}-${index}`}>
                      <Form.Check
                        type="checkbox"
                        id={`time-${timeName}-${index}`}
                        label={timeName}
                        checked={selectedMealTimes.includes(timeName)}
                        onChange={() => onMealTimeChange(timeName)}
                        className="filter-check"
                      />
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          {/* PRICE RANGE ACCORDION */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>Price Range</Accordion.Header>
            <Accordion.Body>
              <Row className="g-2">
                {menuFilters.priceRanges.map((price, index) => (
                  <Col xs={6} key={`price-${price.label}-${index}`}>
                    <Form.Check
                      type="checkbox"
                      id={`price-${price.label}-${index}`}
                      label={price.label}
                      checked={selectedPrices.includes(price.label)}
                      onChange={() => onPriceChange(price.label)}
                      className="filter-check"
                    />
                  </Col>
                ))}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          {/* RATINGS ACCORDION */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>Rating</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-column gap-2">
                {menuFilters.ratings.map((rating, index) => (
                  <Form.Check
                    key={`rating-${rating.value}-${index}`}
                    type="checkbox"
                    id={`rating-${rating.value}-${index}`}
                    checked={selectedRatings.includes(rating.value)}
                    onChange={() => onRatingChange(rating.value)}
                    className="filter-check"
                    label={
                      <span className="rating-filter-label">
                        <RatingStars
                          rating={rating.value}
                          showEmpty={false}
                          size={13}
                        />
                        <span>{rating.value}</span>
                      </span>
                    }
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* DYNAMIC PROMOS ACCORDION */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>Promos</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap gap-2">
                {menuFilters.promos.map((promo, index) => {
                  const promoName = promo.name || promo.label || promo;
                  return (
                    <Button
                      key={`promo-${promoName}-${index}`}
                      size="sm"
                      variant={
                        selectedPromos.includes(promoName)
                          ? "primary"
                          : "outline-secondary"
                      }
                      className="promo-btn"
                      onClick={() => onPromoChange(promoName)}
                    >
                      {promoName}
                    </Button>
                  );
                })}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
}
