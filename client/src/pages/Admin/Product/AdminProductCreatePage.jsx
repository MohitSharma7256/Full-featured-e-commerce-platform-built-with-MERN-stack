import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Sidebar from '../../../components/Sidebar';
import ImageValidator from '../../../Validators/ImageValidator';
import FormValidator from '../../../Validators/FormValidator';
import { createProduct } from "../../../Redux/ActionCreators/ProductActionCreators";
import { getMaincategory } from "../../../Redux/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../../../Redux/ActionCreators/SubcategoryActionCreators";
import { getBrand } from "../../../Redux/ActionCreators/BrandActionCreators";

// Available options for colors and sizes
const AVAILABLE_COLORS = ["white", "red", "green", "blue", "black", "gray", "yellow", "purple", "pink", "orange", "violet", "brown"];
const AVAILABLE_SIZES = ["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "24", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44"];

export default function AdminProductCreatePage() {
    const refdiv = useRef(null);
    const rteRef = useRef(null);

    const [data, setData] = useState({
        name: "",
        maincategory: "",
        subcategory: "",
        brand: "",
        color: [],
        size: [],
        basePrice: "",
        discount: "",
        finalPrice: "",
        description: "",
        stockQuantity: "",
        stock: true,
        pic: [],
        active: true
    });
    const [errorMessage, setErrorMessage] = useState({
        name: "Name Field is Mendatory",
        basePrice: "Base Price Field is Mendatory",
        discount: "Discount Field is Mendatory",
        stockQuantity: "Stock Quantity Field is Mendatory",
        pic: "Pic Field is Mendatory"
    });
    const [show, setShow] = useState(false);

    const MaincategoryStateData = useSelector(state => state.MaincategoryStateData);
    const SubcategoryStateData = useSelector(state => state.SubcategoryStateData);
    const BrandStateData = useSelector(state => state.BrandStateData);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function getInputData(e) {
        let name = e.target.name;
        let value = e.target.files ? e.target.files : e.target.value;

        if (name === "active" || name === "stock") {
            value = value === "1";
        }

        setErrorMessage((old) => ({
            ...old,
            [name]: name === "pic" ? ImageValidator(e) : FormValidator(e)
        }));

        setData((old) => ({
            ...old,
            [name]: value
        }));
    }

    // Fixed checkbox handler - allows complete deselection
    function getCheckboxData(e, field) {
        const name = e.target.name;
        const isChecked = e.target.checked;
        
        setData((old) => {
            const currentArray = field === "Color" ? [...old.color] : [...old.size];
            let newArray;
            
            if (isChecked) {
                // Add to array if checked
                newArray = [...currentArray, name];
            } else {
                // Remove from array if unchecked
                newArray = currentArray.filter(item => item !== name);
            }
            
            return field === "Color" 
                ? { ...old, color: newArray } 
                : { ...old, size: newArray };
        });
    }

    function postData(e) {
        e.preventDefault();

        const error = Object.values(errorMessage).find(x => {
            if (Array.isArray(x)) {
                return x.some(err => err !== "");
            }
            return x !== "";
        });

        if (error) {
            setShow(true);
            return;
        }

        // Validate at least one color and size is selected
        if (data.color.length === 0) {
            setShow(true);
            setErrorMessage(old => ({...old, color: "At least one color must be selected"}));
            return;
        }

        if (data.size.length === 0) {
            setShow(true);
            setErrorMessage(old => ({...old, size: "At least one size must be selected"}));
            return;
        }

        const main = data.maincategory || (MaincategoryStateData.find(x => x.active)?._id || "");
        const sub = data.subcategory || (SubcategoryStateData.find(x => x.active)?._id || "");
        const brand = data.brand || (BrandStateData.find(x => x.active)?._id || "");

        const bp = parseInt(data.basePrice) || 0;
        const d = parseInt(data.discount) || 0;
        const fp = bp - Math.floor((bp * d) / 100);
        const stockQuantity = parseInt(data.stockQuantity) || 0;

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("maincategory", main);
        formData.append("subcategory", sub);
        formData.append("brand", brand);
        
        // Append each color and size as separate entries for flat array storage
        data.color.forEach(color => formData.append("color", color));
        data.size.forEach(size => formData.append("size", size));
        
        formData.append("basePrice", bp);
        formData.append("discount", d);
        formData.append("finalPrice", fp);
        formData.append("stockQuantity", stockQuantity);
        formData.append("description", rteRef.current?.getHTMLCode() || "");
        Array.from(data.pic).forEach(x => formData.append("pic", x));
        formData.append("active", data.active);
        formData.append("stock", data.stock);

        dispatch(createProduct(formData));
        navigate("/admin/product");
    }

    useEffect(() => {
        dispatch(getMaincategory());
    }, []);

    useEffect(() => {
        dispatch(getSubcategory());
    }, []);

    useEffect(() => {
        dispatch(getBrand());
    }, []);

    useEffect(() => {
        if (!rteRef.current) {
            rteRef.current = new window.RichTextEditor(refdiv.current);
            rteRef.current.setHTMLCode("");
        }
    }, []);

    const renderImageError = () => {
        if (!show || !errorMessage.pic) return null;
        if (Array.isArray(errorMessage.pic)) {
            const errors = errorMessage.pic.filter(err => err !== "");
            if (errors.length > 0) {
                return errors.map((err, index) => (
                    <p key={index} className='text-danger mb-0'>{err}</p>
                ));
            }
            return null;
        }
        return errorMessage.pic ? <p className='text-danger'>{errorMessage.pic}</p> : null;
    };

    const hasPicError = () => {
        if (!errorMessage.pic) return false;
        if (Array.isArray(errorMessage.pic)) {
            return errorMessage.pic.some(err => err !== "");
        }
        return errorMessage.pic !== "";
    };

    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>
                                Product
                                <Link to="/admin/product">
                                    <i className='bi bi-arrow-left fs-3 float-end text-light'></i>
                                </Link>
                            </h5>
                            <form onSubmit={postData}>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <label>Name*</label>
                                        <input
                                            type="text"
                                            name="name"
                                            onChange={getInputData}
                                            className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`}
                                            placeholder='Product Full Name'
                                        />
                                        {show && errorMessage.name ? <p className='text-danger'>{errorMessage.name}</p> : null}
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label>Maincategory*</label>
                                        <select
                                            name="maincategory"
                                            onChange={getInputData}
                                            className='form-select border-dark'
                                        >
                                            {MaincategoryStateData.filter(x => x.active).map(item => (
                                                <option key={item._id} value={item._id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label>Subcategory*</label>
                                        <select
                                            name="subcategory"
                                            onChange={getInputData}
                                            className='form-select border-dark'
                                        >
                                            {SubcategoryStateData.filter(x => x.active).map(item => (
                                                <option key={item._id} value={item._id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label>Brand*</label>
                                        <select
                                            name="brand"
                                            onChange={getInputData}
                                            className='form-select border-dark'
                                        >
                                            {BrandStateData.filter(x => x.active).map(item => (
                                                <option key={item._id} value={item._id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <label>Stock*</label>
                                        <select
                                            name="stock"
                                            onChange={getInputData}
                                            className='form-select border-dark'
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Base Price*</label>
                                        <input
                                            type="number"
                                            name="basePrice"
                                            onChange={getInputData}
                                            className={`form-control ${show && errorMessage.basePrice ? 'border-danger' : 'border-dark'}`}
                                            placeholder='Product Base Price'
                                        />
                                        {show && errorMessage.basePrice ? <p className='text-danger'>{errorMessage.basePrice}</p> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Discount*</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            onChange={getInputData}
                                            className={`form-control ${show && errorMessage.discount ? 'border-danger' : 'border-dark'}`}
                                            placeholder='Product Discount'
                                        />
                                        {show && errorMessage.discount ? <p className='text-danger'>{errorMessage.discount}</p> : null}
                                    </div>

                                    <div className="col-12 mb-3">
                                        <label>Color*</label>
                                        <div className="form-control border-dark">
                                            <div className="row">
                                                {AVAILABLE_COLORS.map(color => (
                                                    <div key={color} className="col-xl-2 col-lg-3 col-md-3 col-sm-4 col-6">
                                                        <input
                                                            type="checkbox"
                                                            name={color}
                                                            checked={data.color.includes(color)}
                                                            onChange={(e) => getCheckboxData(e, "Color")}
                                                        />
                                                        <label>&nbsp;&nbsp;{color.charAt(0).toUpperCase() + color.slice(1)}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {show && data.color.length === 0 && <p className='text-danger'>At least one color must be selected</p>}
                                    </div>

                                    <div className="col-12 mb-3">
                                        <label>Size*</label>
                                        <div className="form-control border-dark">
                                            <div className="row">
                                                {AVAILABLE_SIZES.map(size => (
                                                    <div key={size} className="col-xl-2 col-lg-3 col-md-3 col-sm-4 col-6">
                                                        <input
                                                            type="checkbox"
                                                            name={size}
                                                            checked={data.size.includes(size)}
                                                            onChange={(e) => getCheckboxData(e, "Size")}
                                                        />
                                                        <label>&nbsp;&nbsp;{size.toUpperCase()}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {show && data.size.length === 0 && <p className='text-danger'>At least one size must be selected</p>}
                                    </div>

                                    <div className='col-12 mb-3'>
                                        <label>Description*</label>
                                        <div className='form-control border-dark' ref={refdiv}></div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Stock Quantity*</label>
                                        <input
                                            type="number"
                                            name="stockQuantity"
                                            onChange={getInputData}
                                            placeholder='Stock Quantity'
                                            className={`form-control ${show && errorMessage.stockQuantity ? 'border-danger' : 'border-dark'}`}
                                        />
                                        {show && errorMessage.stockQuantity ? <p className='text-danger'>{errorMessage.stockQuantity}</p> : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Pic*</label>
                                        <input
                                            type="file"
                                            name="pic"
                                            onChange={getInputData}
                                            multiple
                                            className={`form-control ${show && hasPicError() ? 'border-danger' : 'border-dark'}`}
                                        />
                                        {renderImageError()}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Active*</label>
                                        <select
                                            name="active"
                                            onChange={getInputData}
                                            className='form-select border-dark'
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>

                                    <div className="col-12 mb-3">
                                        <button type="submit" className='btn btn-dark w-100'>Create</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}