import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Sidebar from '../../../components/Sidebar'
import ImageValidator from '../../../Validators/ImageValidator'
import FormValidator from '../../../Validators/FormValidator'

import { updateProduct, getProduct } from "../../../Redux/ActionCreators/ProductActionCreators"
import { getMaincategory } from "../../../Redux/ActionCreators/MaincategoryActionCreators"
import { getSubcategory } from "../../../Redux/ActionCreators/SubcategoryActionCreators"
import { getBrand } from "../../../Redux/ActionCreators/BrandActionCreators"

// Available options for colors and sizes
const AVAILABLE_COLORS = ["white", "red", "green", "blue", "black", "gray", "yellow", "purple", "pink", "orange", "violet", "brown"];
const AVAILABLE_SIZES = ["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "24", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44"];

export default function AdminProductUpdatePage() {
    
    const { _id } = useParams()
    const refdiv = useRef(null)
    const rteRef = useRef(null) // Use ref for RTE instead of global variable

    const [oldPics, setOldPics] = useState([])
    const [newPics, setNewPics] = useState([])
    const [show, setShow] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    const [rteInitialized, setRteInitialized] = useState(false)

    const [data, setData] = useState({
        name: "",
        maincategory: "",
        subcategory: "",
        brand: "",
        color: [],
        size: [],
        basePrice: "",
        discount: "",
        finalPrice: 0,
        description: "",
        stockQuantity: "",
        stock: true,
        active: true
    })

    const [errorMessage, setErrorMessage] = useState({
        name: "",
        basePrice: "",
        discount: "",
        stockQuantity: "",
        pic: "",
        color: "",
        size: ""
    })

    const ProductStateData = useSelector(state => state.ProductStateData)
    const MaincategoryStateData = useSelector(state => state.MaincategoryStateData)
    const SubcategoryStateData = useSelector(state => state.SubcategoryStateData)
    const BrandStateData = useSelector(state => state.BrandStateData)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Improved array parsing function
    function parseArray(value) {
        if (!value) return []
        
        // If it's already an array, return it flattened
        if (Array.isArray(value)) {
            return value.flat(Infinity).filter(item => item && typeof item === 'string')
        }
        
        // If it's a string, handle various formats
        if (typeof value === 'string') {
            // Try to parse as JSON first
            try {
                const parsed = JSON.parse(value)
                if (Array.isArray(parsed)) {
                    return parsed.flat(Infinity).filter(item => item && typeof item === 'string')
                }
                return [value]
            } catch {
                // If it's a comma-separated string, split it
                if (value.includes(',')) {
                    return value.split(',').map(item => item.trim()).filter(item => item)
                }
                // Single value
                return [value]
            }
        }
        
        return []
    }

    function getInputData(e) {
        const { name, value, files } = e.target

        if (name === "pic") {
            setNewPics(files)
            const error = ImageValidator(e)
            setErrorMessage(old => ({ ...old, pic: error }))
        } else {
            setErrorMessage(old => ({ ...old, [name]: FormValidator(e) }))
        }

        setData(old => ({
            ...old,
            [name]: (name === "active" || name === "stock") ? (value === "1") : value
        }))
    }

    // Fixed checkbox handler - same as create page
    function getCheckboxData(e, field) {
        const { name, checked } = e.target
        
        setData(old => {
            const currentArray = field === "Color" ? [...old.color] : [...old.size];
            let newArray;
            
            if (checked) {
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

    function deleteOldPic(index) {
        setOldPics(prev => prev.filter((_, i) => i !== index))
    }

    function postData(e) {
        e.preventDefault()

        // VALIDATION
        const errors = {}
        if (!data.name) errors.name = "Name required"
        if (!data.basePrice || data.basePrice <= 0) errors.basePrice = "Valid price"
        if (data.discount < 0 || data.discount > 99) errors.discount = "0-99 only"
        if (!data.stockQuantity || data.stockQuantity <= 0) errors.stockQuantity = "Valid qty"
        if (data.color.length === 0) errors.color = "Select at least one color"
        if (data.size.length === 0) errors.size = "Select at least one size"

        if (Object.keys(errors).length > 0) {
            setErrorMessage(prev => ({ ...prev, ...errors }))
            setShow(true)
            return
        }

        // _id check
        if (!_id) {
            alert("Product ID missing! Cannot update.")
            return
        }

        const bp = Number(data.basePrice)
        const d = Number(data.discount)
        const fp = Math.round(bp - (bp * d / 100))

        const formData = new FormData()

        formData.append("name", data.name)
        formData.append("maincategory", data.maincategory)
        formData.append("subcategory", data.subcategory)
        formData.append("brand", data.brand)
        
        // FIX: Append each color and size as separate entries (FLAT ARRAYS)
        data.color.forEach(color => formData.append("color", color))
        data.size.forEach(size => formData.append("size", size))
        
        formData.append("basePrice", bp)
        formData.append("discount", d)
        formData.append("finalPrice", fp)
        formData.append("stockQuantity", data.stockQuantity)
        formData.append("stock", data.stock)
        formData.append("active", data.active)
        
        // Use the RTE ref instead of global variable
        const description = rteRef.current ? rteRef.current.getHTMLCode() : ""
        formData.append("description", description)

        // OLD PICS → COMMA SEPARATED
        formData.append("oldPics", oldPics.length > 0 ? oldPics.join(",") : "")

        // NEW PICS
        Array.from(newPics).forEach(file => formData.append("pic", file))

        console.log("Sending colors (flat):", data.color)
        console.log("Sending sizes (flat):", data.size)

        // DISPATCH WITH CALLBACK
        dispatch(updateProduct({
            formData,
            _id,
            onSuccess: () => {
                console.log("Update successful! Navigating...")
                navigate("/admin/product")
            }
        }))
    }

    // Load all data
    useEffect(() => {
        dispatch(getMaincategory())
        dispatch(getSubcategory())
        dispatch(getBrand())
        dispatch(getProduct())
    }, [dispatch])

    // Initialize RTE - only once when component mounts
    useEffect(() => {
        if (refdiv.current && window.RichTextEditor && !rteRef.current) {
            rteRef.current = new window.RichTextEditor(refdiv.current)
            rteRef.current.setHTMLCode("")
            setRteInitialized(true)
            console.log("RTE initialized")
        }
    }, [])

    // Fill form when product loads AND RTE is initialized
    useEffect(() => {
        if (ProductStateData.length && _id && !dataLoaded && rteInitialized) {
            const item = ProductStateData.find(x => x._id === _id)
            if (item) {
                console.log("Loading product data:", item)
                console.log("Raw color data:", item.color)
                console.log("Raw size data:", item.size)
                
                // Parse and flatten arrays
                const colorArray = parseArray(item.color)
                const sizeArray = parseArray(item.size)
                
                console.log("Parsed colors:", colorArray)
                console.log("Parsed sizes:", sizeArray)

                setData({
                    name: item.name || "",
                    maincategory: item.maincategory?._id || item.maincategory || "",
                    subcategory: item.subcategory?._id || item.subcategory || "",
                    brand: item.brand?._id || item.brand || "",
                    color: colorArray,
                    size: sizeArray,
                    basePrice: item.basePrice?.toString() || "",
                    discount: item.discount?.toString() || "",
                    finalPrice: item.finalPrice || 0,
                    description: item.description || "",
                    stockQuantity: item.stockQuantity?.toString() || "",
                    stock: item.stock ?? true,
                    active: item.active ?? true
                })
                setOldPics(Array.isArray(item.pic) ? item.pic : [])
                
                // Set RTE content - now that RTE is definitely initialized
                if (rteRef.current && item.description) {
                    rteRef.current.setHTMLCode(item.description)
                    console.log("RTE content set")
                }
                
                setDataLoaded(true)
            } else {
                navigate("/admin/product")
            }
        }
    }, [ProductStateData, _id, navigate, dataLoaded, rteInitialized])

    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-3 text-center rounded'>
                                Update Product
                                <Link to="/admin/product">
                                    <i className='bi bi-arrow-left fs-3 float-end text-light'></i>
                                </Link>
                            </h5>

                            {/* Debug info - remove in production */}
                            <div className="mb-3 p-2 bg-light border rounded">
                                <small className="text-muted">
                                    Debug: Colors: [{data.color.join(', ')}] | Sizes: [{data.size.join(', ')}] | 
                                    RTE Ready: {rteInitialized ? 'Yes' : 'No'} | Data Loaded: {dataLoaded ? 'Yes' : 'No'}
                                </small>
                            </div>

                            <form onSubmit={postData}>
                                <div className="row">
                                    {/* Name */}
                                    <div className="col-12 mb-3">
                                        <label>Name*</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={getInputData}
                                            className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`}
                                            placeholder='Product Name'
                                        />
                                        {show && errorMessage.name && <p className='text-danger'>{errorMessage.name}</p>}
                                    </div>

                                    {/* Categories */}
                                    <div className="col-md-3 mb-3">
                                        <label>Maincategory*</label>
                                        <select name="maincategory" value={data.maincategory} onChange={getInputData} className='form-select border-dark'>
                                            <option value="">Choose</option>
                                            {MaincategoryStateData.filter(x => x.active).map(item => (
                                                <option key={item._id} value={item._id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label>Subcategory*</label>
                                        <select name="subcategory" value={data.subcategory} onChange={getInputData} className='form-select border-dark'>
                                            <option value="">Choose</option>
                                            {SubcategoryStateData.filter(x => x.active).map(item => (
                                                <option key={item._id} value={item._id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label>Brand*</label>
                                        <select name="brand" value={data.brand} onChange={getInputData} className='form-select border-dark'>
                                            <option value="">Choose</option>
                                            {BrandStateData.filter(x => x.active).map(item => (
                                                <option key={item._id} value={item._id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label>Stock*</label>
                                        <select name="stock" value={data.stock ? "1" : "0"} onChange={getInputData} className='form-select border-dark'>
                                            <option value="1">In Stock</option>
                                            <option value="0">Out of Stock</option>
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div className="col-md-6 mb-3">
                                        <label>Base Price*</label>
                                        <input type="number" name="basePrice" value={data.basePrice} onChange={getInputData}
                                            className={`form-control ${show && errorMessage.basePrice ? 'border-danger' : 'border-dark'}`} />
                                        {show && errorMessage.basePrice && <p className='text-danger'>{errorMessage.basePrice}</p>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Discount (%)*</label>
                                        <input type="number" name="discount" value={data.discount} onChange={getInputData}
                                            className={`form-control ${show && errorMessage.discount ? 'border-danger' : 'border-dark'}`} />
                                        {show && errorMessage.discount && <p className='text-danger'>{errorMessage.discount}</p>}
                                    </div>

                                    {/* Colors */}
                                    <div className="col-12 mb-3">
                                        <label>Colors* {data.color.length > 0 && <span className="text-muted">({data.color.length} selected)</span>}</label>
                                        <div className={`form-control border-dark p-3 ${show && errorMessage.color ? 'border-danger' : ''}`}>
                                            <div className="row">
                                                {AVAILABLE_COLORS.map(c => (
                                                    <div key={c} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-2">
                                                        <input 
                                                            type="checkbox" 
                                                            name={c} 
                                                            checked={data.color.includes(c)}
                                                            onChange={(e) => getCheckboxData(e, "Color")} 
                                                        />
                                                        <label>&nbsp;{c.charAt(0).toUpperCase() + c.slice(1)}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {show && errorMessage.color && <p className='text-danger'>{errorMessage.color}</p>}
                                    </div>

                                    {/* Sizes */}
                                    <div className="col-12 mb-3">
                                        <label>Sizes* {data.size.length > 0 && <span className="text-muted">({data.size.length} selected)</span>}</label>
                                        <div className={`form-control border-dark p-3 ${show && errorMessage.size ? 'border-danger' : ''}`}>
                                            <div className="row">
                                                {AVAILABLE_SIZES.map(s => (
                                                    <div key={s} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-2">
                                                        <input 
                                                            type="checkbox" 
                                                            name={s} 
                                                            checked={data.size.includes(s)}
                                                            onChange={(e) => getCheckboxData(e, "Size")} 
                                                        />
                                                        <label>&nbsp;{s.toUpperCase()}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {show && errorMessage.size && <p className='text-danger'>{errorMessage.size}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className="col-12 mb-3">
                                        <label>Description*</label>
                                        <div className="form-control border-dark" ref={refdiv} style={{ minHeight: "250px" }}></div>
                                    </div>

                                    {/* Images */}
                                    <div className="col-md-6 mb-3">
                                        <label>New Images (Multiple)</label>
                                        <input
                                            type="file"
                                            name="pic"
                                            onChange={getInputData}
                                            multiple
                                            accept="image/*"
                                            className={`form-control ${show && errorMessage.pic ? 'border-danger' : 'border-dark'}`}
                                        />
                                        {show && errorMessage.pic && <p className='text-danger'>{errorMessage.pic}</p>}
                                        {newPics.length > 0 && <small className="text-success d-block">{newPics.length} new image(s) selected</small>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Current Images (Click × to remove)</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {oldPics.map((pic, index) => (
                                                <div key={index} className="position-relative">
                                                    <img
                                                        src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${pic}`}
                                                        height={80} width={80}
                                                        className="border rounded"
                                                        style={{ objectFit: "cover" }}
                                                        alt="product"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteOldPic(index)}
                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                        style={{ transform: "translate(50%, -50%)" }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Quantity */}
                                    <div className="col-md-6 mb-3">
                                        <label>Stock Quantity*</label>
                                        <input type="number" name="stockQuantity" value={data.stockQuantity} onChange={getInputData}
                                            className={`form-control ${show && errorMessage.stockQuantity ? 'border-danger' : 'border-dark'}`} />
                                        {show && errorMessage.stockQuantity && <p className='text-danger'>{errorMessage.stockQuantity}</p>}
                                    </div>

                                    {/* Active */}
                                    <div className="col-md-6 mb-3">
                                        <label>Active*</label>
                                        <select name="active" value={data.active ? "1" : "0"} onChange={getInputData} className='form-select border-dark'>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>

                                    {/* Submit */}
                                    <div className="col-12 mb-3">
                                        <button type="submit" className='btn btn-dark w-100 py-3 fs-5'>
                                            Update Product
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}