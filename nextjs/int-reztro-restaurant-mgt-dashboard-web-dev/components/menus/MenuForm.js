"use client";

import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "@/styles/menu/menuForm.scss";
import { menuService } from "@/services/menuService";
import { toast } from "react-toastify";
import { logger } from "@/utils/logger";

export default function MenuForm({ initialData, onSubmit, buttonText }) {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [mealTimes, setMealTimes] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      image: "",
      price: "",
      category_id: "",
      tag_ids: "",
      meal_time_ids: "",
      promotion_ids: "",
      description: "",
      values: "",
      ingredients: "",
      calories: "",
      proteins: "",
      fats: "",
      carbs: "",
    },
  });

  useEffect(() => {
    if (!initialData) return;

    reset({
      name: initialData.name || "",
      image: initialData.image || "",
      price: initialData.price || "",

      category_id: initialData.category_id?.toString() || "",

      // tag_ids: initialData.tag_ids?.toString() || "",

      // meal_time_ids: initialData.meal_time_ids?.toString() || "",

      // promotion_ids: initialData.promotion_ids?.toString() || "",

      tag_ids: initialData.tag_ids?.[0]?.toString() || "",
      meal_time_ids: initialData.meal_time_ids?.[0]?.toString() || "",
      promotion_ids: initialData.promotion_ids?.[0]?.toString() || "",

      description: initialData.description || "",
      values: initialData.values || "",
      ingredients: initialData.ingredients || "",

      calories: initialData.calories || "",
      proteins: initialData.proteins || "",
      fats: initialData.fats || "",
      carbs: initialData.carbs || "",
    });

  }, [initialData, reset]);

  const [imageType, setImageType] = useState(
    initialData?.image ? "url" : "url",
  );
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [imageFile, setImageFile] = useState(null);

  const getResponseData = (response, key) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) return response.data;

    if (Array.isArray(response?.data?.data)) return response.data.data;

    if (Array.isArray(response?.data?.[key])) return response.data[key];

    if (Array.isArray(response?.[key])) return response[key];

    if (Array.isArray(response?.data?.items)) return response.data.items;

    if (Array.isArray(response?.items)) return response.items;

    return [];
  };

  const fetchFormData = async () => {

    try {
      const categoryResponse = await menuService.getMenuCategories();

      const categoryData = getResponseData(categoryResponse, "categories");

      setCategories(categoryData.filter((c) => c.is_active === true));
    } catch (error) {
      logger.error("MENU_CATEGORY_FETCH_ERROR", error);
      setCategories([]);
    }

    try {
      const tagResponse = await menuService.getTags();
      const tagData = getResponseData(tagResponse, "tags");

      setTags(tagData.filter((t) => t.is_active === true));
    } catch (error) {
      logger.error("MENU_TAG_FETCH_ERROR", error);
      setTags([]);
    }

    try {
      const mealTimeResponse = await menuService.getMealTimes();
      const mealTimeData = getResponseData(mealTimeResponse, "meal_times");

      setMealTimes(mealTimeData.filter((m) => m.is_active === true));
    } catch (error) {
      logger.error("MENU_MEAL_TIME_FETCH_ERROR", error);
      setMealTimes([]);
    }

    try {
      const promotionResponse = await menuService.getPromotions();
      const promotionData = getResponseData(promotionResponse, "promotions");

      setPromotions(promotionData.filter((p) => p.is_active === true));
    } catch (error) {
      logger.error("MENU_PROMOTION_FETCH_ERROR", error);
      setPromotions([]);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const splitIngredients = (value) => {
    if (Array.isArray(value)) return value;

    if (!value) return [];

    return String(value)
      .split(/,(?![^(]*\))/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const submitHandler = (data) => {
    const finalData = {
      ...data,

      image_file: imageFile,
      image_url: data.image || null,

      values_text: data.values || null,

      ingredients: splitIngredients(data.ingredients),

      nutrition: {
        calories: Number(data.calories || 0),
        proteins: Number(data.proteins || 0),
        fats: Number(data.fats || 0),
        carbs: Number(data.carbs || 0),
      },

      tag_ids: data.tag_ids ? [Number(data.tag_ids)] : [],
      meal_time_ids: data.meal_time_ids ? [Number(data.meal_time_ids)] : [],

      is_featured: false,
      is_top_rated: false,
      is_recommended: false,
      is_new: false,
    };

    if (data.promotion_ids) {
      finalData.promotion_ids = [Number(data.promotion_ids)];
    }

    onSubmit(finalData);
  };

  return (
    <Form onSubmit={handleSubmit(submitHandler)} className="menu-form-card">
      <Row className="g-4">
        <Col lg={8}>
          <div className="form-section">
            <h5>Menu Information</h5>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Enter menu name"
                isInvalid={!!errors.name}
                {...register("name", {
                  required: isEditMode ? false : "Menu name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>

              <div className="image-option-tabs d-flex gap-2 mb-2">
                <Button
                  type="button"
                  className={imageType === "url" ? "active" : ""}
                  onClick={() => setImageType("url")}
                >
                  Image URL
                </Button>

                <Button
                  type="button"
                  className={imageType === "file" ? "active" : ""}
                  onClick={() => setImageType("file")}
                >
                  Choose File
                </Button>
              </div>

              {imageType === "url" ? (
                <Form.Control
                  placeholder="Paste image URL"
                  isInvalid={!!errors.image}
                  {...register("image", {
                    required: isEditMode ? false : "Image is required",
                  })}
                  onChange={(e) => {
                    setValue("image", e.target.value);
                    setImagePreview(e.target.value);
                  }}
                />
              ) : (
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setImageFile(file);

                    const imageUrl = URL.createObjectURL(file);

                    setImagePreview(imageUrl);
                    setValue("image", imageUrl);
                  }}
                />
              )}

              {imagePreview && (
                <div className="image-preview mt-3">
                  <img src={imagePreview} alt="Menu preview" />
                </div>
              )}

              <Form.Control.Feedback type="invalid">
                {errors.image?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="9"
                    isInvalid={!!errors.price}
                    {...register("price", {
                      required: isEditMode ? false : "Price is required",
                      pattern: {
                        value: /^\d+(\.\d+)?$/,
                        message: "Only numbers are allowed",
                      },
                      min: {
                        value: 1,
                        message: "Price must be greater than 0",
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Meal Time</Form.Label>

                  <Form.Select
                    value={watch("meal_time_ids") || ""}
                    onChange={(e) => setValue("meal_time_ids", e.target.value, { shouldValidate: true })}
                    isInvalid={!!errors.meal_time_ids}
                  >
                    <option value="">Select Meal Time</option>

                    {mealTimes.map((meal) => (
                      <option
                        key={meal.meal_time_id}
                        value={meal.meal_time_id.toString()}
                      >
                        {meal.meal_time_name}
                      </option>
                    ))}
                  </Form.Select>

                  {!isEditMode && (
                    <input
                      type="hidden"
                      {...register("meal_time_ids", {
                        required: "Meal Time is required",
                      })}
                    />
                  )}

                  {errors.meal_time_ids && (
                    <div className="invalid-feedback d-block">
                      {errors.meal_time_ids.message}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>

                  <Form.Select
                    value={watch("category_id") || ""}
                    onChange={(e) => setValue("category_id", e.target.value, { shouldValidate: true })}
                    isInvalid={!!errors.category_id}
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id.toString()}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </Form.Select>

                  {!isEditMode && (
                    <input
                      type="hidden"
                      {...register("category_id", {
                        required: "Category is required",
                      })}
                    />
                  )}

                  {errors.category_id && (
                    <div className="invalid-feedback d-block">
                      {errors.category_id.message}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tag</Form.Label>

                  <Form.Select
                    value={watch("tag_ids") || ""}
                    onChange={(e) => setValue("tag_ids", e.target.value, { shouldValidate: true })}
                    isInvalid={!!errors.tag_ids}
                  >
                    <option value="">Select Tag</option>

                    {tags.map((tag) => (
                      <option
                        key={tag.tag_id}
                        value={tag.tag_id.toString()}
                      >
                        {tag.tag_name}
                      </option>
                    ))}
                  </Form.Select>

                  {!isEditMode && (
                    <input
                      type="hidden"
                      {...register("tag_ids", {
                        required: "Tag is required",
                      })}
                    />
                  )}

                  {errors.tag_ids && (
                    <div className="invalid-feedback d-block">
                      {errors.tag_ids.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter description"
                isInvalid={!!errors.description}
                {...register("description", {
                  required: isEditMode ? false : "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Values</Form.Label>
              <Form.Control
                placeholder="Tropical & Refreshing, Creamy & Indulgent"
                isInvalid={!!errors.values}
                {...register("values", {
                  required: isEditMode ? false : "Values are required",
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.values?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </Col>

        <Col lg={4}>
          <div className="form-section">

            <Form.Group className="mb-3">
              <Form.Label>Promotion</Form.Label>

              <Form.Select
                value={watch("promotion_ids") || ""}
                onChange={(e) => {
                  setValue("promotion_ids", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                isInvalid={!!errors.promotion_ids}
              >
                <option value="">Select Promotion</option>

                {promotions.map((promotion) => (
                  <option
                    key={promotion.promotion_id}
                    value={promotion.promotion_id}
                  >
                    {promotion.promotion_title}
                  </option>
                ))}
              </Form.Select>

              {errors.promotion_ids && (
                <div className="invalid-feedback d-block">
                  {errors.promotion_ids.message}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Mango, Coconut milk, Banana"
                isInvalid={!!errors.ingredients}
                {...register("ingredients", {
                  required: isEditMode ? false : "Ingredients are required",
                  pattern: {
                    value: /^[A-Za-z\s,]+$/,
                    message: "Only letters, spaces and commas (,) are allowed",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ingredients?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Calories</Form.Label>
                  <Form.Control
                    placeholder="320"
                    isInvalid={!!errors.calories}
                    {...register("calories", {
                      required: isEditMode ? false : "Calories is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.calories?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Proteins</Form.Label>
                  <Form.Control
                    placeholder="5"
                    isInvalid={!!errors.proteins}
                    {...register("proteins", {
                      required: isEditMode ? false : "Proteins is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.proteins?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fats</Form.Label>
                  <Form.Control
                    placeholder="12"
                    isInvalid={!!errors.fats}
                    {...register("fats", {
                      required: isEditMode ? false : "Fats is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fats?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Carbs</Form.Label>
                  <Form.Control
                    placeholder="50"
                    isInvalid={!!errors.carbs}
                    {...register("carbs", {
                      required: isEditMode ? false : "Carbs is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.carbs?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        <Button type="submit" className="w-100 edit-menu-btn mt-3">
          {buttonText}
        </Button>
      </Row>
    </Form>
  );
}